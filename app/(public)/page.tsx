import Sidebar from "@/components/sidebar"

export default function Home() {
  return (
    <main className="flex">
      <Sidebar>
        <h2 className="text-4xl ">This is a sidebar</h2>
        <p>Option one</p>
        <p>Option two</p>
      </Sidebar>
      <div className="w-full grid place-content-center">
        <h1 className="text-5xl">This is the homepage of BMS</h1>
      </div>

    </main>
  )
}