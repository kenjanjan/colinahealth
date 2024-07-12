export interface SideBarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    onCloseHoverLeave: () => void;
    onCloseHoverEnter: () => void;
    isCloseHovered: boolean;
  }
  
  export interface PatientInfoProps {
    patient_admissionDate: string;
  }
  
  export interface RecentMedicationProps {
    [x: string]: any;
    medicationlogs_notes: string;
    medicationlogs_medicationLogStatus: string;
    medicationlogs_medicationLogsName: string;
    medicationlogs_medicationLogsDate: string;
    medicationlogs_medicationLogsTime: string;
  }
  
  export interface LatestVitalSignProps {
    vitalsign_bloodPressure: string;
    vitalsign_date: string;
    vitalsign_time: string;
    vitalsign_heartRate: string;
    vitalsign_respiratoryRate: string;
    vitalsign_temperature: string;
  }
  
  export interface LatestLabResultProps {
    lab_results_date: string;
    lab_results_fastingBloodGlucose: string;
    lab_results_hdlCholesterol: string;
    lab_results_hemoglobinA1c: string;
    lab_results_ldlCholesterol: string;
    lab_results_totalCholesterol: string;
    lab_results_triglycerides: string;
    lab_results_createdAt: string;
  }
  
  export interface LatestNotesProps {
    notes_createdAt: string;
    notes_notes?: string;
    notes_subject?: string;
  }

  export interface ActiveMedsProps {
    presriptions_name: string;
    prescriptions_dosage: string;
  }
  
  export interface PatientOverviewProps {
    isCollapsed: boolean;
    onOpenHoverEnter: () => void;
    onOpenHoverLeave: () => void;
    toggleSidebar: () => void;
    isOpenHovered: boolean;
  }

  export interface DBRecentMedicationProps {
    recentMedication: RecentMedicationProps;
    isMedicationCollapsed: boolean;
    isPRNCollapsed: boolean;
    toggleMedicationCollapse: () => void;
    patientId: string;
  }

  export interface DBRecentPRNProps {
    recentPRN: RecentMedicationProps;
    isMedicationCollapsed: boolean;
    isPRNCollapsed: boolean;
    togglePRNCollapse: () => void;
  }
  export interface SearchIconProps {
    className?: string;
    w?: number;
    h?: number;
  }
  