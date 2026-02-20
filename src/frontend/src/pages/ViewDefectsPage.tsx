import DefectReportList from '../components/DefectReportList';
import { FileText } from 'lucide-react';

export default function ViewDefectsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Defect Reports</h2>
        </div>
        <p className="text-muted-foreground">
          View and filter all reported defects across departments and products.
        </p>
      </div>
      <DefectReportList />
    </div>
  );
}
