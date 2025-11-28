# Usage

## CRITICAL: ACTION SCHEMA RULES

**When the user provides an image along with their request:**
- **ONLY use the fields the user explicitly mentions in their text prompt**

**Example:**
- User says: "Input should be nsn and quantity. Output should be comment."
- User provides an image showing 10 different fields
- **CORRECT**: Create action schema with ONLY `nsn`, `quantity` as inputs and `comment` as output. 
- **WRONG**: Extract all 10 fields from the image and add them to the action chema

**The user's text description is the ONLY source of truth for action schema fields.**

---

## CRITICAL: DO NOT MODIFY THESE FILES

The following files are pre-configured and MUST NOT be modified, regenerated, or rewritten:

| File | Reason |
|------|--------|
| `src/hooks/useActionContext.ts` | Action Center integration hook. Already configured. |
| `src/lib/uipath.ts` | UiPath SDK client configuration. Already configured. |
| `src/components/action/*` | Pre-built Action components. Use as-is. |
| `src/types/action-schema.ts` | Type definitions. Use as-is. |

**ONLY modify:** `src/pages/ActionPage.tsx` and `action-schema.json`

## Overview

UiPath Action App Template - Frontend React application for building Human-in-the-Loop (HITL) interfaces that integrate with UiPath Action Center.

- Frontend: React + TypeScript + ShadCN UI + Tailwind
- Integration: UiPath SDK TaskEventsService for Action Center communication
- Architecture: Pure frontend - runs inside Action Center iframe

## Key Pattern: No Loading State

**IMPORTANT:** Action Apps render immediately with initial data. There is NO loading state.
- Form displays right away with `initialData` values
- When Action Center sends real data, the form updates automatically
- This works in all environments: local dev, nucleus preview, and Action Center

## What is an Action App?

An Action App is a web application that:
1. **Receives data** from an automated process (inputs, inOuts)
2. **Displays a UI** for human review/interaction
3. **Collects user input** (outputs, modified inOuts)
4. **Captures a decision** (outcomes like Approve/Reject)
5. **Returns data** to the automation workflow

## Action Schema (action-schema.json)

Every Action App MUST have an `action-schema.json` file in the project root that defines the data contract:

```json
{
  "inputs": {
    "type": "object",
    "properties": {
      "applicantName": { "type": "string", "required": true },
      "loanAmount": { "type": "number", "required": true }
    }
  },
  "outputs": {
    "type": "object",
    "properties": {
      "riskFactor": { "type": "integer", "required": true },
      "reviewerComments": { "type": "string" }
    }
  },
  "inOuts": {
    "type": "object",
    "properties": {}
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

### Schema Rules

| Category | Description | Editable |
|----------|-------------|----------|
| `inputs` | Read-only data from automation | No (disabled) |
| `outputs` | Data user must provide | Yes |
| `inOuts` | Pre-filled, user can edit | Yes |
| `outcomes` | Decision buttons (Approve, Reject, etc.) | N/A |

### Property Types

| Type | Description |
|------|-------------|
| `string` | Text input |
| `number` | Decimal number |
| `integer` | Whole number |
| `boolean` | Checkbox/switch |
| `date` | Date picker |

### Schema Naming Rules
1. Use **camelCase** for property names: `applicantName`, `loanAmount`
2. **ALWAYS** have at least one outcome for task completion
3. Never use reserved keywords: `result`, `Result`

## useActionContext Hook

Main hook for Action Center integration. **No loading state needed.**

```typescript
import { useActionContext } from '@/hooks/useActionContext';

export function ActionPage() {
  const {
    taskData,              // Task metadata from Action Center (null until received)
    formData,              // Form state (inputs + outputs + inOuts)
    isReadOnly,            // Whether task is read-only (completed)
    hasActionCenterData,   // Whether Action Center has sent data yet
    updateField,           // Update a single field
    completeTask,          // Complete with outcome
  } = useActionContext({
    // Initial data shown immediately (before Action Center sends data)
    initialData: {
      applicantName: 'Test User',
      loanAmount: 25000,
    }
  });

  // NO loading check needed - form renders immediately

  return (
    <div>
      {/* Preview banner (shown before Action Center sends data) */}
      {!hasActionCenterData && (
        <div className="bg-yellow-100 p-2">Preview Mode</div>
      )}

      {/* Display inputs (read-only) */}
      <p>Applicant: {formData.applicantName}</p>
      <p>Loan Amount: ${formData.loanAmount}</p>

      {/* Collect outputs */}
      <input
        type="number"
        value={formData.riskFactor || ''}
        onChange={(e) => updateField('riskFactor', parseInt(e.target.value))}
        disabled={isReadOnly}
      />

      {/* Outcome buttons */}
      <button onClick={() => completeTask('Approve')}>Approve</button>
      <button onClick={() => completeTask('Reject')}>Reject</button>
    </div>
  );
}
```

## Pre-built Components

### OutcomeButtons

Renders outcome buttons with auto-icons:

```typescript
import { OutcomeButtons } from '@/components/action/OutcomeButtons';

<OutcomeButtons
  outcomes={['Approve', 'Reject', 'Escalate']}
  onOutcome={(outcome) => completeTask(outcome)}
  disabled={!isFormValid}
/>
```

### ActionFormField

Renders form fields based on type:

```typescript
import { ActionFormField } from '@/components/action/ActionFormField';

<ActionFormField
  name="reviewerComments"
  label="Comments"
  type="string"
  required={true}
  readOnly={false}
  value={formData.reviewerComments}
  onChange={(value) => updateField('reviewerComments', value)}
/>
```

### ReadOnlyField

Displays input values (read-only):

```typescript
import { ReadOnlyField } from '@/components/action/ActionFormField';

<ReadOnlyField
  label="Applicant Name"
  value={formData.applicantName}
/>
```

## Complete Example

```typescript
import { useActionContext } from '@/hooks/useActionContext';
import { OutcomeButtons } from '@/components/action/OutcomeButtons';
import { ReadOnlyField } from '@/components/action/ActionFormField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ActionPage() {
  const {
    formData,
    isLoading,
    isReadOnly,
    isDevMode,
    updateField,
    completeTask,
  } = useActionContext({
    // Mock data for local testing
    devMockData: {
      applicantName: 'Jane Smith',
      loanAmount: 75000,
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading task data...</p>
      </div>
    );
  }

  // Validate required outputs
  const isValid = formData.riskFactor !== undefined &&
                 formData.riskFactor >= 1 &&
                 formData.riskFactor <= 10;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Dev mode indicator */}
      {isDevMode && (
        <Alert>
          <AlertDescription>
            Running in development mode with mock data
          </AlertDescription>
        </Alert>
      )}

      {/* Application Details - Inputs (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReadOnlyField label="Applicant Name" value={formData.applicantName} />
          <ReadOnlyField label="Loan Amount" value={`$${formData.loanAmount}`} />
        </CardContent>
      </Card>

      {/* Assessment - Outputs (user fills) */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Risk Factor (1-10) *</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={formData.riskFactor || ''}
              onChange={(e) => updateField('riskFactor', parseInt(e.target.value))}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label>Comments</Label>
            <Textarea
              value={formData.reviewerComments || ''}
              onChange={(e) => updateField('reviewerComments', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Decision - Outcomes */}
      {!isReadOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <OutcomeButtons
              outcomes={['Approve', 'Reject']}
              onOutcome={completeTask}
              disabled={!isValid}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## File Structure

```
project-root/
├── action-schema.json          # REQUIRED: Action schema definition
├── src/
│   ├── lib/
│   │   └── uipath.ts           # SDK client (do not modify)
│   ├── hooks/
│   │   └── useActionContext.ts # Action Center hook (do not modify)
│   ├── components/
│   │   └── action/
│   │       ├── OutcomeButtons.tsx
│   │       ├── ActionFormField.tsx
│   │       └── ActionFormRenderer.tsx
│   ├── types/
│   │   └── action-schema.ts    # Type definitions
│   └── pages/
│       └── ActionPage.tsx      # Main action page (customize this)
```

## Development Workflow

### DO:
- Create `action-schema.json` with inputs, outputs, inOuts, outcomes
- Use `useActionContext` with `devMockData` for local testing
- Display inputs as read-only (disabled)
- Collect outputs with form fields
- Always have at least one outcome button
- Validate required outputs before enabling outcomes

### DO NOT:
- Add any fields to `action-schema.json` that the user did not explicitly specify
- Modify `src/types/action-schema.ts` - contains critical exports (getInputType, VBDataType)
- Modify `src/lib/uipath.ts` - SDK is pre-configured
- Modify `src/hooks/useActionContext.ts` - hook is ready to use
- Modify `src/components/action/*` - pre-built components
- Forget to pass `devMockData` for local testing
- Complete task without collecting required outputs

## Tech Stack

- React 18, TypeScript, Vite
- ShadCN UI, Tailwind CSS, Lucide icons
- uipath-sdk for Action Center integration

## Deployment

Action apps are deployed to UiPath and run inside Action Center as iframes.
The app communicates with Action Center via postMessage events.

When deployed:
- `useActionContext` detects it's in an iframe and connects to Action Center
- Mock data is ignored; real task data comes from Action Center
- `completeTask()` sends the outcome back to the automation workflow
