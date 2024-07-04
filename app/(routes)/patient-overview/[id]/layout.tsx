import Sidebar from "@/components/Sidebar";
import { EditProvider } from "./editContext";
import PatientOverviewComponent from "@/components/patientOverview";
import Footer from "@/components/footer";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen relative">
      <Sidebar/>
      <div className="flex flex-col w-full  h-full">
        <div className="px-20 pt-24 h-full">

        <EditProvider>
          <PatientOverviewComponent />
          <div className="w-full flex items-center justify-center mt-4">
            {children}
          </div>
        </EditProvider>
        </div>
        <Footer/>                                             
      </div>
    </div>
  );
}
