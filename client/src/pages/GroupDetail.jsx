import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaEdit,
  FaCrown,
  FaUserShield,
  FaUserMinus,
  FaUserPlus,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import GroupForm from "../components/groups/GroupForm";
import GroupChat from "../components/chat/GroupChat";
import ProfileCard from "../components/chat/ProfileCard";
import UnreadBadge from "../components/chat/UnreadBadge";
import { useDmSocket } from "../components/chat/useDmSocket";
import Avatar from "../components/common/Avatar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  getGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  updateGroupMemberRole,
  getGroupTasks,
  createGroupTask,
  updateGroupTask,
  deleteGroupTask,
  resolveAssetUrl,
} from "../services/api";

const cardStyle = { borderWidth: 1, borderColor: "var(--primary-dark)" };

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  // After login the user object has `id`; after a page refresh it has `_id`.
  const myId = user?._id || user?.id;

  const [group, setGroup] = useState(null);
  const [groupError, setGroupError] = useState("");
  const [tab, setTab] = useState("tasks"); // "tasks" | "chat" | "members"
  const [chatTaskId, setChatTaskId] = useState(""); // set by a task's "Discuss" button
  const [profileId, setProfileId] = useState(null); // whose profile box is open
  const dm = useDmSocket(myId); // private-message unread counts + live events

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [filter, setFilter] = useState(""); // "" | "mine" | "Pending" | "Done"
  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditGroup, setShowEditGroup] = useState(false);

  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [memberError, setMemberError] = useState("");

  const isAdmin = group?.myRole === "admin";

  const FILTERS = [
    { label: t("groups.all"), value: "" },
    { label: t("groups.mine"), value: "mine" },
    { label: t("groups.pending"), value: "Pending" },
    { label: t("groups.done"), value: "Done" },
  ];

  // ---------------- loading ----------------

  const fetchGroup = useCallback(() => {
    return getGroup(id)
      .then((res) => setGroup(res.data))
      .catch((err) => {
        console.error("Failed to load group:", err);
        setGroupError(err.response?.data?.message || t("groups.loadError"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTasks = useCallback(() => {
    const params = { search: search || undefined };
    if (filter === "mine") params.assignedTo = "me";
    else if (filter) params.status = filter;

    setLoadingTasks(true);
    getGroupTasks(id, params)
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error("Failed to load group tasks:", err);
        // Group errors are already shown by fetchGroup; avoid double banners
        if (err.response?.status !== 404) setError(t("groups.saveError"));
      })
      .finally(() => setLoadingTasks(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, search, filter]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  useEffect(() => {
    // Debounce search so we don't hit the API on every keystroke
    const timeout = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  // ---------------- task actions ----------------

  const canDeleteTask = (task) => isAdmin || task.user?._id === myId;

  const handleSaveTask = async (data) => {
    try {
      setSubmitting(true);
      setError("");
      if (editingTask) {
        await updateGroupTask(id, editingTask._id, data);
      } else {
        await createGroupTask(id, data);
      }
      setShowTaskForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to save group task:", err);
      setError(err.response?.data?.message || t("groups.saveError"));
      setShowTaskForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(t("groups.confirmDeleteTask"))) return;
    try {
      await deleteGroupTask(id, taskId);
      setTasks((prev) => prev.filter((x) => x._id !== taskId));
    } catch (err) {
      console.error("Failed to delete group task:", err);
      setError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Done"
        : "Pending";

    try {
      const res = await updateGroupTask(id, task._id, { status: nextStatus });
      setTasks((prev) => prev.map((x) => (x._id === task._id ? res.data : x)));
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  // ---------------- group / member actions ----------------

  const handleEditGroup = async (data) => {
    try {
      setSubmitting(true);
      const res = await updateGroup(id, data);
      setGroup(res.data);
      setShowEditGroup(false);
    } catch (err) {
      console.error("Failed to update group:", err);
      setError(err.response?.data?.message || t("groups.saveError"));
      setShowEditGroup(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setAdding(true);
      setMemberError("");
      const res = await addGroupMember(id, email.trim());
      setGroup(res.data);
      setEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.message || t("groups.saveError"));
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm(t("groups.confirmRemove"))) return;
    try {
      await removeGroupMember(id, userId);
      // Their tasks become unassigned on the server, so refresh both
      fetchGroup();
      fetchTasks();
    } catch (err) {
      setMemberError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  const handleChangeRole = async (userId, role) => {
    try {
      const res = await updateGroupMemberRole(id, userId, role);
      setGroup(res.data);
    } catch (err) {
      setMemberError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(t("groups.confirmLeave"))) return;
    try {
      await removeGroupMember(id, myId);
      navigate("/groups");
    } catch (err) {
      setMemberError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(t("groups.confirmDelete"))) return;
    try {
      await deleteGroup(id);
      navigate("/groups");
    } catch (err) {
      setMemberError(err.response?.data?.message || t("groups.saveError"));
    }
  };

  // ---------------- render ----------------

  const backLink = (
    <Link
      to="/groups"
      className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
    >
      <FaArrowLeft /> {t("groups.back")}
    </Link>
  );

  if (groupError) {
    return (
      <PageTransition>
        <MainLayout>
          <div className="max-w-3xl mx-auto space-y-4 py-10 text-center">
            <p className="text-red-400">{groupError}</p>
            {backLink}
          </div>
        </MainLayout>
      </PageTransition>
    );
  }

  if (!group) {
    return (
      <PageTransition>
        <MainLayout>
          <p className="text-center text-gray-400 py-10">{t("groups.loadingGroup")}</p>
        </MainLayout>
      </PageTransition>
    );
  }

  const roleBadge = (m) => {
    if (m.isOwner) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-yellow-400">
          <FaCrown /> {t("groups.owner")}
        </span>
      );
    }
    if (m.role === "admin") {
      return (
        <span
          className="flex items-center gap-1 text-[10px] font-semibold uppercase"
          style={{ color: "var(--primary-light)" }}
        >
          <FaUserShield /> {t("groups.admin")}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold uppercase text-gray-400">
        {t("groups.member")}
      </span>
    );
  };

  return (
    <PageTransition>
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ================= HEADER ================= */}
          <section
            className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] p-5 sm:p-8 lg:p-10"
            style={cardStyle}
          >
            <div
              className="absolute -top-10 -right-10 w-48 h-48 lg:w-72 lg:h-72 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--primary)" }}
            ></div>

            <div className="relative z-10 space-y-4">
              {backLink}

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="min-w-0">
                  <h1 className="text-2xl lg:text-5xl font-bold text-white break-words">
                    {group.name}
                  </h1>
                  {group.description && (
                    <p className="mt-2 text-sm lg:text-base text-gray-300">
                      {group.description}
                    </p>
                  )}

                  {/* member avatars */}
                  <div className="mt-4 flex items-center">
                    {group.members.slice(0, 6).map((m) => (
                      <Avatar
                        key={m.user._id}
                        src={resolveAssetUrl(m.user.avatar)}
                        alt={m.user.name}
                        sizeClass="w-8 h-8"
                        className="-ml-2 first:ml-0 ring-2 ring-[#102417]"
                      />
                    ))}
                    {group.members.length > 6 && (
                      <span className="ml-2 text-xs text-gray-300">
                        +{group.members.length - 6}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {isAdmin && (
                    <button
                      onClick={() => setShowEditGroup(true)}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm text-gray-200 hover:bg-white/10 transition"
                      style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
                    >
                      <FaEdit /> {t("groups.editGroup")}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskForm(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm lg:text-base text-white transition"
                    style={{ background: "var(--primary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
                  >
                    <FaPlus /> {t("groups.newTask")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= TABS ================= */}
          <div className="flex gap-2">
            {[
              { key: "tasks", label: t("groups.tabTasks") },
              { key: "chat", label: t("groups.tabChat") },
              { key: "members", label: `${t("groups.tabMembers")} (${group.members.length})` },
            ].map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => {
                  setTab(tabItem.key);
                  setChatTaskId(""); // a manual tab switch drops the "Discuss" preselection
                }}
                className={`rounded-xl px-5 py-3 text-sm transition ${
                  tab === tabItem.key ? "text-white" : "bg-[#162117] text-gray-300 hover:bg-[#1D2C20]"
                }`}
                style={
                  tab === tabItem.key ? { background: "var(--primary)" } : cardStyle
                }
              >
                {tabItem.label}
                {tabItem.key === "chat" && dm.totalUnread > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {dm.totalUnread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* ================= TASKS TAB ================= */}
          {tab === "tasks" && (
            <>
              <section className="flex flex-col lg:flex-row gap-4">
                <div
                  className="flex items-center flex-1 bg-[#162117] rounded-xl px-4 py-3"
                  style={cardStyle}
                >
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("groups.searchPlaceholder")}
                    className="ml-3 w-full bg-transparent outline-none text-sm lg:text-base text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:flex">
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`rounded-xl px-4 py-3 text-sm transition ${
                        filter === f.value
                          ? "text-white"
                          : "bg-[#162117] text-gray-300 hover:bg-[#1D2C20]"
                      }`}
                      style={filter === f.value ? { background: "var(--primary)" } : cardStyle}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                {loadingTasks && (
                  <p className="text-center text-gray-400 py-10">{t("tasks.loading")}</p>
                )}

                {!loadingTasks && tasks.length === 0 && (
                  <p className="text-center text-gray-400 py-10">
                    {filter || search ? t("groups.noMatch") : t("groups.noTasks")}
                  </p>
                )}

                {!loadingTasks &&
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      canDelete={canDeleteTask(task)}
                      onEdit={(tk) => {
                        setEditingTask(tk);
                        setShowTaskForm(true);
                      }}
                      onDelete={handleDeleteTask}
                      onToggleStatus={handleToggleStatus}
                      onDiscuss={(tk) => {
                        setChatTaskId(tk._id);
                        setTab("chat");
                      }}
                    />
                  ))}
              </section>
            </>
          )}

          {/* ================= CHAT TAB ================= */}
          {tab === "chat" && (
            <GroupChat
              groupId={id}
              myId={myId}
              isAdmin={isAdmin}
              presetTaskId={chatTaskId}
              unread={dm.unread}
              onOpenProfile={setProfileId}
              onGone={() => navigate("/groups")}
            />
          )}

          {/* ================= MEMBERS TAB ================= */}
          {tab === "members" && (
            <section className="space-y-6">
              {memberError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-xl px-4 py-3">
                  {memberError}
                </p>
              )}

              {isAdmin && (
                <form
                  onSubmit={handleAddMember}
                  className="rounded-2xl bg-[#162117] p-5 space-y-3"
                  style={cardStyle}
                >
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <FaUserPlus /> {t("groups.addMember")}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{t("groups.addMemberHint")}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("groups.emailPlaceholder")}
                      className="flex-1 rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500"
                      style={cardStyle}
                    />
                    <button
                      type="submit"
                      disabled={adding || !email.trim()}
                      className="rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 transition"
                      style={{ background: "var(--primary)" }}
                    >
                      {adding ? t("groups.adding") : t("groups.add")}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {group.members.map((m) => {
                  const isSelf = m.user._id === myId;

                  return (
                    <div
                      key={m.user._id}
                      className="rounded-2xl bg-[#162117] p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                      style={cardStyle}
                    >
                      <button
                        type="button"
                        onClick={() => setProfileId(m.user._id)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <span className="relative shrink-0">
                          <Avatar
                            src={resolveAssetUrl(m.user.avatar)}
                            alt={m.user.name}
                            sizeClass="w-11 h-11"
                          />
                          {!isSelf && <UnreadBadge count={dm.unread[m.user._id]} />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">
                            {m.user.name}
                            {isSelf && (
                              <span className="ml-2 text-xs text-gray-400">
                                ({t("groups.you")})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{m.user.email}</p>
                        </div>
                      </button>

                      <div className="flex items-center gap-4 sm:justify-end">
                        {roleBadge(m)}

                        {group.isOwner && !m.isOwner && (
                          <button
                            onClick={() =>
                              handleChangeRole(m.user._id, m.role === "admin" ? "member" : "admin")
                            }
                            className="text-xs text-gray-300 hover:text-white transition"
                          >
                            {m.role === "admin" ? t("groups.makeMember") : t("groups.makeAdmin")}
                          </button>
                        )}

                        {isAdmin && !m.isOwner && !isSelf && (
                          <button
                            onClick={() => handleRemoveMember(m.user._id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                          >
                            <FaUserMinus /> {t("groups.remove")}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                {group.isOwner ? (
                  <button
                    onClick={handleDeleteGroup}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    <FaTrash /> {t("groups.deleteGroup")}
                  </button>
                ) : (
                  <button
                    onClick={handleLeave}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    <FaSignOutAlt /> {t("groups.leave")}
                  </button>
                )}
              </div>
            </section>
          )}
        </div>

        {showTaskForm && (
          <TaskForm
            initialData={editingTask}
            submitting={submitting}
            members={group.members.map((m) => m.user)}
            onSubmit={handleSaveTask}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {profileId && group.members.some((m) => m.user._id === profileId) && (
          <ProfileCard
            member={group.members.find((m) => m.user._id === profileId)}
            isMe={profileId === myId}
            myId={myId}
            dm={dm}
            onClose={() => setProfileId(null)}
          />
        )}

        {showEditGroup && (
          <GroupForm
            initialData={group}
            submitting={submitting}
            onSubmit={handleEditGroup}
            onClose={() => setShowEditGroup(false)}
          />
        )}
      </MainLayout>
    </PageTransition>
  );
}

export default GroupDetail;
