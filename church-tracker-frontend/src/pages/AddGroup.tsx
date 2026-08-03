import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import GroupForm from "../components/GroupForm";
import type { Group } from "../api/types";

export default function AddGroup() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Add Group</h2>
      <GroupForm
        submitLabel="Create Group"
        onSubmit={async (data) => {
          await api.post<Group>("/groups/", data);
          navigate("/groups");
        }}
      />
    </div>
  );
}
