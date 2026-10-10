import DataTable from "../components/DataTable";
import { laureatsColumns, laureatsData } from "../data/laureats";

export default function LaureatsPage() {
  return <DataTable columns={laureatsColumns} data={laureatsData} />;
}
