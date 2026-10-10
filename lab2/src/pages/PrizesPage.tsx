import DataTable from "../components/DataTable";
import { prizesColumns, prizesData } from "../data/prizes";

export default function PrizesPage() {
  return <DataTable columns={prizesColumns} data={prizesData} />;
}
