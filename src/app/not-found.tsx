import Image from "next/image";

export default function NotFound() {
  return (
    <div className=" w-full h-screen grid place-items-center">
      <div className="space-y-1 text-center">
        <Image
          src={"/image/404.png"}
          alt="404"
          width={200}
          height={200}
          className=" w-[100px] h-[100px] mx-auto"
        />
        <h2>Not Found 404</h2>
      </div>
    </div>
  );
}
