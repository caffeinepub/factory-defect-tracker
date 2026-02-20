import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewDefectReport, DefectReportView } from '../backend';

export function useGetAllReports() {
  const { actor, isFetching } = useActor();

  return useQuery<DefectReportView[]>({
    queryKey: ['defect-reports', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReportsByDepartment(department?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<DefectReportView[]>({
    queryKey: ['defect-reports', 'department', department],
    queryFn: async () => {
      if (!actor || !department) return [];
      return actor.getReportsByDepartment(department);
    },
    enabled: !!actor && !isFetching && !!department,
  });
}

export function useCreateDefectReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: NewDefectReport) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createDefectReport(report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defect-reports'] });
    },
  });
}
