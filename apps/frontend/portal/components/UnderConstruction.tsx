import { Box } from "@mantine/core";
import Image from "next/image";

export default function UnderConstruction() {
  return (
    <main
      className="min-h-[calc(100vh-80px)] bg-gradient-to-br flex items-center justify-center p-4"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <Image
        src="/undraw_under-construction_c2y1.svg" // Replace with an actual image or illustration
        alt="No data"
        width={300}
        height={300}
        style={{ opacity: 0.7 }}
      />
      <div className="text-center  max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Under Construction
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
          We&apos;re working hard to build something amazing. Check back soon!
        </p>

        <div className="mb-12">
          <p className="text-lg">For inquiries, contact us at:</p>
          <a
            href="mailto:info@heranitech.com"
            className="text-xl md:text-2xl underline hover:opacity-80 transition-opacity"
          >
            info@heranitech.com
          </a>
        </div>

        <Box className="h-14 border-t border-gray-300 text-sm px-4 flex flex-col items-center justify-center">
          <span className="">
            © {new Date().getFullYear()} All rights reserved by{" "}
          </span>
          <span className="">Shega Jobs</span>
        </Box>
      </div>
    </main>
  );
}
