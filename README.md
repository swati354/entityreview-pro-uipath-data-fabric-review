# EntityReview Pro - UiPath Data Fabric Review

A professional UiPath Action App for human reviewers to examine, validate, and make decisions on entity data from UiPath Data Fabric.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/entityreview-pro-uipath-data-fabric-review)

## Overview

EntityReview Pro is a professional UiPath Action App designed to streamline the human-in-the-loop review process for structured data stored in UiPath Data Fabric entities. This application provides an intuitive and information-dense interface for business users to examine entity records, provide critical feedback, and make approval or rejection decisions that integrate seamlessly back into UiPath automation workflows.

## Key Features

- **Entity Data Fetcher**: Utilizes the UiPath SDK's entity service to retrieve all records associated with a specified entity name
- **Data Presentation Layer**: Displays fetched entity records in a clean, professional, and sortable data table
- **Reviewer Feedback Module**: Provides a dedicated input area for reviewers to enter comments regarding their assessment
- **Decision & Outcome Handler**: Presents clear 'Approve' and 'Reject' buttons with validation
- **User Experience Enhancements**: Includes loading indicators, error messages, and read-only mode for completed tasks
- **Enterprise Aesthetic**: Maintains a consistent corporate design with neutral color palette and compact layouts

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: ShadCN/UI, TailwindCSS
- **UiPath Integration**: uipath-sdk, @tanstack/react-query
- **Icons**: lucide-react
- **State Management**: Zustand
- **Deployment**: Cloudflare Pages
- **Package Manager**: Bun

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- UiPath Orchestrator access with Data Fabric entities
- Valid UiPath credentials for SDK integration

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd entity-review-pro
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your UiPath credentials:
```env
VITE_UIPATH_BASE_URL=https://your-uipath-instance.com
VITE_UIPATH_ORG_NAME=your-org-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_ACCESS_TOKEN=your-access-token
```

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Action Schema Configuration

The application uses `action-schema.json` to define the data contract with UiPath Action Center:

```json
{
  "inputs": {
    "type": "object",
    "properties": {
      "entityName": { "type": "string", "required": true }
    }
  },
  "outputs": {
    "type": "object",
    "properties": {
      "comments": { "type": "string", "required": true }
    }
  },
  "outcomes": {
    "type": "object",
    "properties": {
      "Approve": { "type": "string" },
      "Reject": { "type": "string" }
    }
  }
}
```

### Key Components

- **ActionPage.tsx**: Main application component handling entity data display and user interactions
- **useActionContext**: Hook for Action Center integration and form state management
- **useEntityRecords**: Hook for fetching entity records from UiPath Data Fabric
- **OutcomeButtons**: Pre-built component for handling approval/rejection decisions

## Usage

### In UiPath Studio

1. Add an "Action Center" activity to your workflow
2. Configure the activity with:
   - **Action Title**: "Entity Review"
   - **Assigned To**: Target user or group
   - **Input Arguments**: `entityName` (string)
   - **Output Arguments**: `comments` (string), `outcome` (string)

3. Deploy the workflow to UiPath Orchestrator

### In Action Center

1. Users will receive tasks in their Action Center inbox
2. The EntityReview Pro app loads with the specified entity data
3. Users review the entity records displayed in the table
4. Users provide mandatory comments about their assessment
5. Users select either "Approve" or "Reject" to complete the task

### Example Workflow Integration

```vb
' In UiPath Studio workflow
Dim entityToReview As String = "CustomerData"
Dim reviewComments As String
Dim reviewOutcome As String

' Action Center activity
ActionCenter.CreateTask(
    title:="Review Customer Data",
    assignedTo:="ReviewTeam",
    inputs:=New Dictionary(Of String, Object) From {
        {"entityName", entityToReview}
    },
    outputs:=reviewComments,
    outcome:=reviewOutcome
)

' Process the review results
If reviewOutcome = "Approve" Then
    ' Continue with approved workflow
Else
    ' Handle rejection workflow
End If
```

## Building for Production

Build the application:
```bash
bun run build
```

Preview the production build:
```bash
bun run preview
```

## Deployment

### Cloudflare Pages

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/entityreview-pro-uipath-data-fabric-review)

1. **Automatic Deployment**: Use the deploy button above for one-click deployment to Cloudflare Pages

2. **Manual Deployment**:
   ```bash
   # Build the project
   bun run build
   
   # Deploy to Cloudflare Pages
   npx wrangler pages deploy dist
   ```

3. **Environment Variables**: Configure the following in your Cloudflare Pages dashboard:
   - `VITE_UIPATH_BASE_URL`
   - `VITE_UIPATH_ORG_NAME`
   - `VITE_UIPATH_TENANT_NAME`
   - `VITE_UIPATH_ACCESS_TOKEN`

### UiPath Action Center Integration

1. Upload the built application to UiPath Action Center
2. Configure the action app in your UiPath tenant
3. Reference the action app in your Studio workflows

## Project Structure

```
src/
├── components/
│   ├── action/          # Pre-built Action Center components
│   ├── ui/              # ShadCN UI components
│   └── layout/          # Layout components
├── hooks/
│   ├── useActionContext.ts    # Action Center integration
│   ├── useEntityRecords.ts    # Entity data fetching
│   └── useUiPathEntities.ts   # UiPath entities management
├── lib/
│   ├── uipath.ts        # UiPath SDK configuration
│   └── utils.ts         # Utility functions
├── pages/
│   └── ActionPage.tsx   # Main application page
└── types/
    └── action-schema.ts # Type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the [UiPath Documentation](https://docs.uipath.com/)
- Review the [UiPath SDK Documentation](https://www.npmjs.com/package/uipath-sdk)
- Open an issue in this repository