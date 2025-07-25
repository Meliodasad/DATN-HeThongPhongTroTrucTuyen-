import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function HomepageLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <Header />

      {/* Main content full width + full height */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}