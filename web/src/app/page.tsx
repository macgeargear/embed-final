import Dashboard from "@/components/Dashboard";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="-mt-10">
      <div className="py-20 mx-auto text-center flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-8">
          Embeded System final project
        </h1>
        <Dashboard />
      </div>
    </MaxWidthWrapper>
  );
}
