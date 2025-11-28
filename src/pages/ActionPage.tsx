import React from 'react';
import { useActionContext } from '@/hooks/useActionContext';
import { useEntityRecords } from '@/hooks/useEntityRecords';
import { OutcomeButtons } from '@/components/action/OutcomeButtons';
import { ActionFormField } from '@/components/action/ActionFormField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, AlertCircle, CheckCircle, XCircle, Beaker } from 'lucide-react';
/**
 * Initial data for the form (shown before Action Center sends data)
 */
const INITIAL_DATA = {
  entityName: 'SampleEntity',
};
/**
 * EntityReview Pro Action App
 *
 * Allows reviewers to examine entity data from UiPath Data Fabric,
 * provide comments, and make approval/rejection decisions.
 */
export function ActionPage() {
  const {
    formData,
    isReadOnly,
    hasActionCenterData,
    updateField,
    completeTask,
  } = useActionContext({
    initialData: INITIAL_DATA,
  });
  const {
    records,
    loading: recordsLoading,
    error: recordsError,
    fetchByName,
  } = useEntityRecords();
  // Extract entity name from form data
  const entityName = formData.entityName as string;
  // Fetch entity records when entityName changes
  React.useEffect(() => {
    if (entityName) {
      fetchByName(entityName);
    }
  }, [entityName, fetchByName]);
  // Check if required outputs are filled
  const isFormValid = formData.comments && (formData.comments as string).trim().length > 0;
  // Render table headers from first record
  const renderTableHeaders = () => {
    if (!records || records.length === 0) return null;
    const firstRecord = records[0];
    const headers = Object.keys(firstRecord).filter(key => key !== 'id');
    return (
      <TableHeader>
        <TableRow className="border-gray-200">
          {headers.map((header) => (
            <TableHead key={header} className="px-3 py-2 text-sm font-medium text-gray-900 border-r border-gray-200 last:border-r-0">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };
  // Render table rows
  const renderTableRows = () => {
    if (!records || records.length === 0) return null;
    const headers = Object.keys(records[0]).filter(key => key !== 'id');
    return (
      <TableBody>
        {records.map((record, index) => (
          <TableRow key={record.id || index} className="hover:bg-gray-50 border-gray-200">
            {headers.map((header) => (
              <TableCell key={header} className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
                {record[header] !== null && record[header] !== undefined
                  ? String(record[header])
                  : '-'
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-6">
          {/* Preview mode indicator */}
          {!hasActionCenterData && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Beaker className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Preview Mode</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Showing sample data. In Action Center, real entity data will be displayed.
              </AlertDescription>
            </Alert>
          )}
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                EntityReview Pro
              </h1>
              <p className="text-muted-foreground">
                Review entity data and provide your assessment
              </p>
            </div>
          </div>
          {/* Read-only notice */}
          {isReadOnly && (
            <Alert className="border-gray-200">
              <AlertCircle className="h-4 w-4 text-gray-600" />
              <AlertTitle className="text-gray-900">Read Only</AlertTitle>
              <AlertDescription className="text-gray-700">
                This task has already been completed and cannot be modified.
              </AlertDescription>
            </Alert>
          )}
          {/* Entity Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">Entity Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Entity Name: </span>
                <span className="text-gray-900">{entityName}</span>
              </div>
            </CardContent>
          </Card>
          {/* Entity Data Table */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">Entity Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recordsLoading && (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
              {recordsError && (
                <div className="p-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Error Loading Entity Data</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {recordsError}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              {!recordsLoading && !recordsError && records && records.length === 0 && (
                <div className="p-6 text-center">
                  <div className="text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No records found for entity "{entityName}"</p>
                  </div>
                </div>
              )}
              {!recordsLoading && !recordsError && records && records.length > 0 && (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <Table>
                    {renderTableHeaders()}
                    {renderTableRows()}
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Reviewer Assessment */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">Reviewer Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActionFormField
                name="comments"
                label="Reviewer Comments"
                type="string"
                required={true}
                readOnly={isReadOnly}
                value={formData.comments}
                onChange={(value) => updateField('comments', value)}
                description="Please provide your assessment and reasoning for the decision"
                placeholder="Enter your detailed comments about the entity data..."
              />
            </CardContent>
          </Card>
          {/* Decision Section */}
          {!isReadOnly && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <OutcomeButtons
                    outcomes={['Approve', 'Reject']}
                    onOutcome={completeTask}
                    disabled={!isFormValid}
                  />
                </div>
                {!isFormValid && (
                  <p className="text-sm text-muted-foreground">
                    Please provide reviewer comments before making a decision.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            © Powered by UiPath
          </div>
        </div>
      </div>
    </div>
  );
}
export default ActionPage;