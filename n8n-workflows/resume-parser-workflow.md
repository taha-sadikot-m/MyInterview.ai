# N8N Resume Parser Workflow

## Workflow Overview
This workflow automatically parses uploaded PDF resumes, extracts structured information, and stores it in Supabase for use in mock interviews.

## Workflow Steps

### 1. Webhook Trigger
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Endpoint**: `/parse-resume`
- **Expected Payload**:
```json
{
  "resume_id": "uuid",
  "user_id": "uuid", 
  "file_url": "supabase_storage_url",
  "file_name": "resume.pdf"
}
```

### 2. Update Resume Status
- **Node Type**: Supabase
- **Operation**: UPDATE
- **Table**: resumes
- **Condition**: id = {{ $json.resume_id }}
- **Data**: 
```json
{
  "parsing_status": "processing",
  "updated_at": "{{ new Date().toISOString() }}"
}
```

### 3. Download PDF from Supabase Storage
- **Node Type**: HTTP Request
- **Method**: GET
- **URL**: {{ $json.file_url }}
- **Headers**: 
  - Authorization: Bearer {{ $credentials.supabase.service_key }}
- **Response Format**: Binary

### 4. Convert PDF to Text
- **Node Type**: Code (JavaScript)
- **Purpose**: Extract text content from PDF
- **Dependencies**: pdf-parse
- **Code**:
```javascript
const pdf = require('pdf-parse');

const pdfBuffer = items[0].binary.data;
const data = await pdf(pdfBuffer);

return [{ 
  json: { 
    text_content: data.text,
    page_count: data.numpages,
    resume_id: $('Webhook').first().json.resume_id
  } 
}];
```

### 5. AI Text Analysis (OpenAI/GPT)
- **Node Type**: OpenAI
- **Model**: gpt-4-turbo
- **System Prompt**:
```
You are a resume parsing AI. Extract structured information from the resume text and return a JSON object with the following fields:

- personal_info: {name, email, phone, location, linkedin, portfolio}
- education: [{degree, institution, year, gpa, relevant_courses}]
- experience: [{title, company, duration, responsibilities, achievements}]
- skills: {technical_skills, soft_skills, tools_and_technologies}
- projects: [{name, description, technologies, duration, achievements}]
- certifications: [{name, issuer, date, validity}]
- achievements: [string array]
- languages: [{language, proficiency}]

Only return valid JSON. If any section is not found, use empty arrays or null values.
```
- **User Prompt**: `Please parse this resume text and extract structured information: {{ $json.text_content }}`

### 6. Validate and Clean Extracted Data
- **Node Type**: Code (JavaScript)
- **Purpose**: Validate JSON structure and clean data
- **Code**:
```javascript
try {
  const extractedData = JSON.parse(items[0].json.choices[0].message.content);
  
  // Validate required fields
  const requiredFields = ['personal_info', 'education', 'experience', 'skills'];
  const isValid = requiredFields.every(field => extractedData.hasOwnProperty(field));
  
  if (!isValid) {
    throw new Error('Missing required fields in extracted data');
  }
  
  // Clean and normalize data
  const cleanedData = {
    ...extractedData,
    extracted_at: new Date().toISOString(),
    parsing_method: 'ai_gpt4'
  };
  
  return [{
    json: {
      success: true,
      extracted_data: cleanedData,
      resume_id: $('Webhook').first().json.resume_id
    }
  }];
  
} catch (error) {
  return [{
    json: {
      success: false,
      error: error.message,
      resume_id: $('Webhook').first().json.resume_id
    }
  }];
}
```

### 7. Update Resume with Extracted Data (Success Path)
- **Node Type**: Supabase
- **Operation**: UPDATE
- **Table**: resumes
- **Condition**: id = {{ $json.resume_id }}
- **Data**:
```json
{
  "extracted_data": "{{ JSON.stringify($json.extracted_data) }}",
  "parsing_status": "completed",
  "updated_at": "{{ new Date().toISOString() }}"
}
```

### 8. Update Resume with Error (Error Path)
- **Node Type**: Supabase
- **Operation**: UPDATE
- **Table**: resumes
- **Condition**: id = {{ $json.resume_id }}
- **Data**:
```json
{
  "parsing_status": "failed",
  "parsing_error": "{{ $json.error }}",
  "updated_at": "{{ new Date().toISOString() }}"
}
```

### 9. Send Webhook Response
- **Node Type**: Respond to Webhook
- **Response Body**:
```json
{
  "success": "{{ $json.success }}",
  "resume_id": "{{ $json.resume_id }}",
  "message": "{{ $json.success ? 'Resume parsed successfully' : 'Resume parsing failed' }}"
}
```

## Error Handling

### Retry Logic
- PDF download failures: Retry 3 times with exponential backoff
- AI API failures: Retry 2 times with 5-second delay
- Database connection issues: Retry 3 times

### Fallback Strategies
1. If AI parsing fails, attempt rule-based parsing
2. If complete parsing fails, extract basic text and save as partial data
3. Always update resume status to reflect current state

## Configuration

### Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
WEBHOOK_AUTH_TOKEN=secure_token_for_webhook_auth
```

### Webhook Security
- Implement token-based authentication
- Validate request origin
- Rate limiting: 10 requests per minute per user

### Monitoring
- Log all processing steps
- Track success/failure rates
- Monitor processing time
- Alert on consecutive failures

## Usage Example

### Frontend Integration
```javascript
// Upload resume to Supabase Storage
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('resumes')
  .upload(`${userId}/resume.pdf`, file);

if (!uploadError) {
  // Create resume record
  const { data: resumeData, error: resumeError } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      file_name: file.name,
      file_url: uploadData.path,
      file_size: file.size,
      parsing_status: 'pending'
    })
    .select();

  // Trigger parsing workflow
  const response = await fetch('https://your-n8n-instance.com/webhook/parse-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${webhookToken}`
    },
    body: JSON.stringify({
      resume_id: resumeData[0].id,
      user_id: userId,
      file_url: `${supabaseUrl}/storage/v1/object/public/resumes/${uploadData.path}`,
      file_name: file.name
    })
  });
}
```

## Testing

### Test Cases
1. **Valid PDF Resume**: Upload a standard PDF resume and verify extraction
2. **Scanned PDF**: Test with image-based PDF (should fail gracefully)
3. **Invalid PDF**: Test with corrupted file
4. **Large File**: Test with file > 5MB
5. **Non-English Resume**: Test multilingual support
6. **Minimal Resume**: Test with very basic resume
7. **Complex Resume**: Test with detailed resume including projects, certifications

### Expected Outputs
- Personal information extracted correctly
- Education history with proper formatting
- Work experience with achievements
- Skills categorized appropriately
- Projects with technical details
- Proper error handling and status updates