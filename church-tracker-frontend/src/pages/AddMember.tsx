import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import MemberForm from "../components/MemberForm";
import type { Member } from "../api/types";

export default function AddMember() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  if (!groupId) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Add Member</h2>
      <MemberForm
        groupId={Number(groupId)}
        submitLabel="Add Member"
        onSubmit={async (data) => {
          await api.post<Member>("/members/", data);
          navigate(`/groups/${groupId}`);
        }}
      />
    </div>
  );
}
