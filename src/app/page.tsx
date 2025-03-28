import Navbar from "@/components/Navbar";
import MapFilter from "@/components/MapFilter";
import HeatMap from "@/components/HeatMap";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <MapFilter />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <HeatMap />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
