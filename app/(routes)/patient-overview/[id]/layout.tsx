import PatientOverviewPage from "@/components/patientOverviewPage";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen relative">
      <PatientOverviewPage children={children}/>
    </div>
  );
}
