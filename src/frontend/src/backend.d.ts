import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface NewDefectReport {
    description: string;
    productName: string;
    employeeId: string;
    photo?: ExternalBlob;
    department: string;
}
export interface DefectReportView {
    id: bigint;
    description: string;
    productName: string;
    employeeId: string;
    timestamp: Time;
    photo?: ExternalBlob;
    department: string;
}
export interface backendInterface {
    createDefectReport(report: NewDefectReport): Promise<bigint>;
    getAllReports(): Promise<Array<DefectReportView>>;
    getReportsByDepartment(departmentText: string): Promise<Array<DefectReportView>>;
    getReportsByProduct(productName: string): Promise<Array<DefectReportView>>;
}
