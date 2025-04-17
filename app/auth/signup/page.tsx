import RoleSelection from "@/components/auth/role-selection";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 ">
      <RoleSelection />
    </div>
  );
}
