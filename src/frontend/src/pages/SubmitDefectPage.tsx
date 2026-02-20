import DefectReportForm from '../components/DefectReportForm';
import { AlertCircle } from 'lucide-react';

export default function SubmitDefectPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-3">Report a Defect</h2>
        <div className="flex items-start gap-3 p-4 bg-accent/50 border border-border rounded-lg">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">Quality Control Guidelines</p>
            <p className="text-muted-foreground">
              Document any defects found during production. Include product details, department location,
              a clear description, and photos when possible. Your reports help maintain our quality standards.
            </p>
          </div>
        </div>
      </div>
      <DefectReportForm />
    </div>
  );
}
