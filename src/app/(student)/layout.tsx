import type { Metadata } from "next";
import StudentProvider from "@/components/student/StudentProvider";
import StudentShell from "@/components/student/StudentShell";
import "./student.css";

export const metadata: Metadata = {
  title: "Área do aluno",
  robots: { index: false, follow: false },
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <StudentShell>{children}</StudentShell>
    </StudentProvider>
  );
}
