import Navbar from "./components/Navbar";
import Slider from "./components/Slider";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="py-10 p-2">
        <Slider />
      </div>
      <div className=" flex gap-8 flex-wrap lg:justify-center align-middle p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-600">
          Day of the <span className="text-[#7688db]"> Deal</span>
        </h1>
        <p className="text-sm text-gray-500 font-thin">
          Don’t wait. The time will never be just right.
        </p>
      </div>

      <h1>home</h1>
    </div>
  );
}
