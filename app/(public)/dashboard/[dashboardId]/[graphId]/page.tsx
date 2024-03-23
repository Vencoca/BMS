type dashboardProps = {
  params: { graphId: string; dashboardId: string };
};

export default function Dashboard({ params }: dashboardProps) {
  return <h1>{params.graphId}</h1>;
}
