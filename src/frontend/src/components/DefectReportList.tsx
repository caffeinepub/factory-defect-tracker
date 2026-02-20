import { useState } from 'react';
import { useGetAllReports, useGetReportsByDepartment } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageIcon, Calendar, User, Package, Building2 } from 'lucide-react';
import type { DefectReportView } from '../backend';

const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'cutting', label: 'Prikrojevalnica (Cutting)' },
  { value: 'machining', label: 'Strojna (Machining)' },
  { value: 'assembly', label: 'Montažni (Assembly)' },
  { value: 'painting', label: 'Lakirnica (Painting)' },
  { value: 'embossing', label: 'Emblirnica (Embossing)' },
];

const DEPARTMENT_COLORS: Record<string, string> = {
  cutting: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  machining: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  assembly: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  painting: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  embossing: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
};

export default function DefectReportList() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const allReportsQuery = useGetAllReports();
  const departmentReportsQuery = useGetReportsByDepartment(
    selectedDepartment !== 'all' ? selectedDepartment : undefined
  );

  const query = selectedDepartment === 'all' ? allReportsQuery : departmentReportsQuery;
  const reports = query.data || [];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return new Intl.DateTimeFormat('sl-SI', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDepartmentLabel = (dept: string) => {
    return DEPARTMENTS.find((d) => d.value === dept)?.label || dept;
  };

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Filter by Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full max-w-xs h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-bold text-foreground">{reports.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No defect reports found</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDepartment === 'all'
                    ? 'No defects have been reported yet.'
                    : `No defects reported in ${getDepartmentLabel(selectedDepartment)}.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-24">Photo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report: DefectReportView) => (
                    <TableRow key={report.id.toString()}>
                      <TableCell className="font-mono text-xs">{report.id.toString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium">{report.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={DEPARTMENT_COLORS[report.department] || ''}
                        >
                          {getDepartmentLabel(report.department)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">{report.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{report.employeeId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(report.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.photo ? (
                          <button
                            onClick={() => setSelectedImage(report.photo!.getDirectURL())}
                            className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
                          >
                            <img
                              src={report.photo.getDirectURL()}
                              alt="Defect"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Defect Photo</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Defect full size"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
