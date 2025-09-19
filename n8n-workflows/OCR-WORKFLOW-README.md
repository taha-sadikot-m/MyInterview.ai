# Resume Parser Workflow with OCR.space

## Overview
This N8N workflow processes resume uploads using OCR.space API for text extraction and OpenAI GPT-4 for structured data parsing.

## Workflow Steps

1. **Resume Parser Webhook** 
   - Receives POST requests at `/webhook/parse-resume`
   - Expects: `{ resume_id, user_id, file_url }`

2. **Validate Input**
   - Validates UUID format for resume_id
   - Checks file_url exists
   - Extracts data from webhook body

3. **Update Resume Status**
   - Sets parsing_status to "processing"
   - Updates Supabase resumes table

4. **OCR Text Extraction** 
   - Uses OCR.space API (Key: K89456578088957)
   - Processes PDF from file_url
   - Extracts text from all pages

5. **Process OCR Results**
   - Validates OCR response
   - Combines text from all pages
   - Handles OCR errors

6. **AI Resume Analysis**
   - Uses OpenAI GPT-4 to parse extracted text
   - Structures data into JSON format
   - Creates comprehensive resume profile

7. **Validate Extracted Data**
   - Validates required fields
   - Creates fallback template if parsing fails
   - Ensures data consistency

8. **Update Database**
   - Success: Updates with extracted_data
   - Error: Updates with error message
   - Sets final parsing_status

9. **Webhook Response**
   - Returns success/failure status
   - Includes resume_id and page_count

## API Configuration

### OCR.space API
- **Endpoint**: `https://api.ocr.space/parse/image`
- **API Key**: `K89456578088957`
- **Parameters**:
  - language: eng
  - isOverlayRequired: true
  - filetype: PDF

### OpenAI API
- **Model**: gpt-4
- **Purpose**: Parse OCR text into structured data
- **Output**: JSON with personal_info, education, experience, skills, etc.

## Data Structure

```json
{
  "personal_info": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "portfolio": "string"
  },
  "education": [
    {
      "degree": "string",
      "institution": "string", 
      "year": "string",
      "gpa": "string",
      "relevant_courses": []
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string", 
      "responsibilities": [],
      "achievements": []
    }
  ],
  "skills": {
    "technical_skills": [],
    "soft_skills": [],
    "tools_and_technologies": []
  },
  "projects": [],
  "certifications": [],
  "achievements": [],
  "languages": []
}
```

## Frontend Validation

- **File Type**: PDF only
- **File Size**: Max 10MB
- **Page Limit**: Max 3 pages (validated during upload)
- **Error Handling**: User-friendly toast notifications

## Error Handling

1. **OCR Errors**: Fallback template with manual review flags
2. **AI Parsing Errors**: Structured fallback data
3. **Network Errors**: Proper error messages and database updates
4. **Validation Errors**: Clear user feedback

## Usage

1. Import `resume-parser-workflow-ocr.json` into N8N
2. Activate the workflow
3. Test with resume upload in the application
4. Monitor execution logs for debugging

## Dependencies

- OCR.space API (active subscription)
- OpenAI API (GPT-4 access)
- Supabase database (resumes table)
- N8N instance (active workflow)