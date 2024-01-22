import { useAppSelector } from "../../redux/hooks";

function Dashboard() {
  const user = useAppSelector((state) => state.user);
  return <h1>Welcome {user.username}</h1>;
}

export default Dashboard;
