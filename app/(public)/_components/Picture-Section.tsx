import students from "@/public/students.png";
import Image from "next/image";
import subhero from "@/public/sub-hero.png";

export function PictureSection() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-24 mt-32 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">
          Turn Knowledge Into{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-violet-500">
            Impact
          </span>
        </h1>
        <p className="text-xl text-center text-muted-foreground max-w-md line-clamp-2">
          Create professional video courses and share them with your students
          effortlessly.
        </p>
        <p className="text-xl text-center text-muted-foreground max-w-md line-clamp-2">
          Upload videos, customize lessons, and craft learning experiences your
          students will love.
        </p>

        <Image src={students} alt="students image" width={300} height={300} />
      </div>
      <div>
        <Image src={subhero} alt="students image" width={800} height={600} className="rounded-lg"/>
      </div>
    </div>
  );
}
