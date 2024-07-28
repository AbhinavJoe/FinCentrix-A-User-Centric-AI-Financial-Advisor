import Authentication from "@/app/Authentication/layout"
import Login from "@/app/Authentication/Login/page"

export default function Home() {
  return (
    <main>
      <Authentication children={<Login />} />
    </main>
  );
}
