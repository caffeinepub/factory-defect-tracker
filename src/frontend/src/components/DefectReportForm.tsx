import { useState } from 'react';
import { useCreateDefectReport } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Loader2, CheckCircle2, Upload } from 'lucide-react';
import { ExternalBlob } from '../backend';

const DEPARTMENTS = [
  { value: 'cutting', label: 'Prikrojevalnica (Cutting)' },
  { value: 'machining', label: 'Strojna (Machining)' },
  { value: 'assembly', label: 'Montažni (Assembly)' },
  { value: 'painting', label: 'Lakirnica (Painting)' },
  { value: 'embossing', label: 'Emblirnica (Embossing)' },
];

export default function DefectReportForm() {
  const [productName, setProductName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const createMutation = useCreateDefectReport();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    setUploadProgress(0);

    try {
      let photoBlob: ExternalBlob | undefined;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await createMutation.mutateAsync({
        productName,
        department,
        description,
        employeeId,
        photo: photoBlob,
      });

      // Reset form
      setProductName('');
      setDepartment('');
      setDescription('');
      setEmployeeId('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting defect report:', error);
    }
  };

  const isFormValid = productName && department && description && employeeId;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Defect Information</CardTitle>
        <CardDescription>Fill in all required fields to submit a defect report</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-base font-semibold">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name or code"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-base font-semibold">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select value={department} onValueChange={setDepartment} required>
              <SelectTrigger id="department" className="h-11">
                <SelectValue placeholder="Select department" />
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

          <div className="space-y-2">
            <Label htmlFor="employeeId" className="text-base font-semibold">
              Employee ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your employee ID"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Defect Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the defect in detail..."
              required
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo" className="text-base font-semibold">
              Photo (Optional)
            </Label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo')?.click()}
                  className="h-11"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {photoFile ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {photoFile && (
                  <span className="text-sm text-muted-foreground">{photoFile.name}</span>
                )}
              </div>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoPreview && (
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading photo...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {showSuccess && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Defect report submitted successfully!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isFormValid || createMutation.isPending}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Submit Defect Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
