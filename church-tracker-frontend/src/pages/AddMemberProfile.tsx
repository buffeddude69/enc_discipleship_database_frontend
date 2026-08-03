import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import MemberForm from "../components/MemberForm";
import type { Member } from "../api/types";

export default function AddMemberProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forGroup = searchParams.get("forGroup");

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">New Member Profile</h2>
      <MemberForm
        submitLabel="Create Profile"
        onSubmit={async (data) => {
          const member = await api.postForm<Member>("/members/", data);
          if (forGroup) {
            navigate(`/groups/${forGroup}/add-member?member=${member.id}`);
          } else {
            navigate(`/members/${member.id}`);
          }
        }}
      />
    </div>
  );
}
