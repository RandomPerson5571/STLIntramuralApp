"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import DetailRow from "@/components/ui/DetailRow";
import PaginationBar from "@/components/ui/PaginationBar";
import SlideOverPanel from "@/components/ui/SlideOverPanel";
import { useAdminUserDetail, useAdminUsers } from "@/hooks/useAdmin";
import {
  useAdjustAdminUserPoints,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "@/hooks/useAdminUserActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { USER_ROLE_LABELS } from "@/lib/constants/user-labels";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  DEFAULT_ADMIN_USERS_PAGE_SIZE,
  type AdminUser,
} from "@/lib/queries/admin";
import { USER_ROLES, type UserRole } from "@/types/database";

function formatPoints(points: number): string {
  return points > 0 ? `+${points.toLocaleString()}` : points.toLocaleString();
}

function UsersSkeleton() {
  return (
    <ul className="divide-y divide-surface-variant/50">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="grid gap-sm p-md sm:grid-cols-[1.4fr_5rem_5rem_6rem] sm:items-center"
        >
          <span className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
          <span className="hidden h-4 w-16 animate-pulse rounded bg-surface-container sm:block" />
          <span className="hidden h-4 w-12 animate-pulse rounded bg-surface-container sm:block" />
          <span className="hidden h-8 w-24 animate-pulse rounded-xl bg-surface-container sm:block" />
        </li>
      ))}
    </ul>
  );
}

type EditFormState = {
  firstName: string;
  lastName: string;
  role: UserRole;
  isAdmin: boolean;
  graduationYear: string;
  pointsDelta: string;
  pointsDescription: string;
};

function toEditForm(user: AdminUser): EditFormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isAdmin: user.isAdmin,
    graduationYear: user.graduationYear?.toString() ?? "",
    pointsDelta: "",
    pointsDescription: "",
  };
}

function UserDetailPanel({
  userId,
  open,
  initialMode,
  onClose,
  onDeleted,
}: {
  userId: string | null;
  open: boolean;
  initialMode: "view" | "edit";
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { data: user, isPending, isError, refetch } = useAdminUserDetail(userId);
  const { data: currentUser } = useCurrentUser();
  const updateUser = useUpdateAdminUser();
  const adjustPoints = useAdjustAdminUserPoints();
  const deleteUser = useDeleteAdminUser();

  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setConfirmDelete(false);
      setSaveError(null);
    }
  }, [open, initialMode, userId]);

  useEffect(() => {
    if (user) {
      setForm(toEditForm(user));
    }
  }, [user]);

  const isSelf = userId === currentUser?.id;
  const isSaving = updateUser.isPending || adjustPoints.isPending;
  const isDeleting = deleteUser.isPending;

  const handleSave = async () => {
    if (!user || !form) return;

    setSaveError(null);

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName || !lastName) {
      setSaveError("First and last name are required.");
      return;
    }

    const graduationYear =
      form.role === "student" && form.graduationYear.trim()
        ? Number.parseInt(form.graduationYear, 10)
        : null;

    if (
      form.role === "student" &&
      form.graduationYear.trim() &&
      Number.isNaN(graduationYear)
    ) {
      setSaveError("Graduation year must be a valid number.");
      return;
    }

    const pointsDelta = form.pointsDelta.trim()
      ? Number.parseInt(form.pointsDelta, 10)
      : 0;

    if (form.pointsDelta.trim() && Number.isNaN(pointsDelta)) {
      setSaveError("Points adjustment must be a valid number.");
      return;
    }

    if (pointsDelta !== 0 && !form.pointsDescription.trim()) {
      setSaveError("Provide a description for the points adjustment.");
      return;
    }

    if (pointsDelta !== 0 && user.pointsBalance + pointsDelta < 0) {
      setSaveError("Adjustment would make the balance negative.");
      return;
    }

    try {
      await updateUser.mutateAsync({
        userId: user.id,
        input: {
          firstName,
          lastName,
          role: form.role,
          isAdmin: form.isAdmin,
          graduationYear,
        },
      });

      if (pointsDelta !== 0) {
        await adjustPoints.mutateAsync({
          userId: user.id,
          delta: pointsDelta,
          description: form.pointsDescription.trim(),
        });
      }

      setMode("view");
      setForm((prev) =>
        prev
          ? { ...prev, pointsDelta: "", pointsDescription: "" }
          : prev,
      );
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser.mutateAsync(user.id);
      onDeleted();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not remove user.";
      setSaveError(
        message.includes("violates foreign key")
          ? "Cannot remove this user while they host events or sell shop items."
          : message,
      );
      setConfirmDelete(false);
    }
  };

  const panelFooter = (
    <div className="flex w-full flex-col gap-2">
      {mode === "view" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSaveError(null);
              setMode("edit");
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-sm font-label-sm uppercase text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,opacity] duration-200 hover:bg-primary-fixed-variant active:scale-[0.98]"
          >
            <MaterialSymbol icon="edit" className="text-base" />
            Edit user
          </button>
          {!isSelf && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-error/30 px-4 py-2.5 text-label-sm font-label-sm uppercase text-error transition-colors hover:bg-error/[0.06]"
            >
              <MaterialSymbol icon="delete" className="text-base" />
              Remove
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSaveError(null);
              setMode("view");
              if (user) setForm(toEditForm(user));
            }}
            disabled={isSaving}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-surface-variant/70 px-4 py-2.5 text-label-sm font-label-sm uppercase text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-sm font-label-sm uppercase text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="flex items-center justify-between gap-sm rounded-xl border border-error/20 bg-error/[0.04] px-md py-sm">
          <p className="text-body-sm font-body-sm text-on-surface">
            Remove this user permanently?
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={isDeleting}
              className="rounded-lg px-2 py-1 text-label-sm font-label-sm text-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
              className="rounded-lg bg-error px-2 py-1 text-label-sm font-label-sm text-on-error disabled:opacity-50"
            >
              {isDeleting ? "Removing…" : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SlideOverPanel
      open={open && userId !== null}
      onClose={onClose}
      closeAriaLabel="Close user details"
      title={user?.fullName ?? "User details"}
      subtitle={
        user
          ? `${USER_ROLE_LABELS[user.role]}${user.isAdmin ? " · Admin access" : ""}`
          : undefined
      }
      footer={panelFooter}
    >
              {isPending && !user ? (
                <div className="space-y-md">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="block h-4 w-full animate-pulse rounded bg-surface-container"
                    />
                  ))}
                </div>
              ) : isError || !user || !form ? (
                <div className="flex flex-col items-center gap-sm py-lg text-center">
                  <MaterialSymbol
                    icon="error_outline"
                    className="text-3xl text-on-surface-variant"
                  />
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Could not load user details.
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="text-label-sm font-label-sm text-primary hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : mode === "view" ? (
                <div className="space-y-lg">
                  <dl className="space-y-md">
                    <DetailRow
                      label="Points balance"
                      value={
                        <span className="text-primary tabular-nums">
                          {user.pointsBalance.toLocaleString()}
                        </span>
                      }
                    />
                    <DetailRow label="First name" value={user.firstName} />
                    <DetailRow label="Last name" value={user.lastName} />
                    <DetailRow label="Role" value={USER_ROLE_LABELS[user.role]} />
                    <DetailRow
                      label="Admin access"
                      value={user.isAdmin ? "Yes" : "No"}
                    />
                    {user.role === "student" && (
                      <DetailRow
                        label="Graduation year"
                        value={user.graduationYear ?? "—"}
                      />
                    )}
                    <DetailRow
                      label="Member since"
                      value={formatDate(user.createdAt)}
                    />
                  </dl>

                  <section>
                    <h3 className="mb-sm text-label-sm font-label-sm uppercase tracking-wide text-outline">
                      Recent transactions
                    </h3>
                    {user.recentTransactions.length === 0 ? (
                      <p className="text-body-sm font-body-sm text-on-surface-variant">
                        No point transactions yet.
                      </p>
                    ) : (
                      <ul className="divide-y divide-surface-variant/50 rounded-xl border border-surface-variant/60">
                        {user.recentTransactions.map((txn) => (
                          <li
                            key={txn.id}
                            className="flex items-start justify-between gap-sm p-sm"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-body-sm font-body-sm text-on-surface">
                                {txn.description}
                              </p>
                              <p className="text-label-sm font-label-sm text-outline">
                                {formatDateTime(txn.createdAt)}
                                {txn.eventTitle ? ` · ${txn.eventTitle}` : ""}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 tabular-nums text-body-sm font-body-sm ${
                                txn.points >= 0 ? "text-primary" : "text-error"
                              }`}
                            >
                              {formatPoints(txn.points)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              ) : (
                <div className="space-y-md">
                  <div className="grid gap-sm sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="admin-user-first"
                        className="text-label-sm font-label-sm uppercase tracking-wide text-outline"
                      >
                        First name
                      </label>
                      <input
                        id="admin-user-first"
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="admin-user-last"
                        className="text-label-sm font-label-sm uppercase tracking-wide text-outline"
                      >
                        Last name
                      </label>
                      <input
                        id="admin-user-last"
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="admin-user-role"
                      className="text-label-sm font-label-sm uppercase tracking-wide text-outline"
                    >
                      Role
                    </label>
                    <select
                      id="admin-user-role"
                      value={form.role}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {USER_ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.role === "student" && (
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="admin-user-grad"
                        className="text-label-sm font-label-sm uppercase tracking-wide text-outline"
                      >
                        Graduation year
                      </label>
                      <input
                        id="admin-user-grad"
                        type="number"
                        inputMode="numeric"
                        value={form.graduationYear}
                        onChange={(e) =>
                          setForm({ ...form, graduationYear: e.target.value })
                        }
                        placeholder="e.g. 2027"
                        className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                    <input
                      type="checkbox"
                      checked={form.isAdmin}
                      onChange={(e) =>
                        setForm({ ...form, isAdmin: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-surface-variant accent-primary"
                    />
                    Grant admin access
                  </label>

                  <div className="rounded-xl border border-surface-variant/60 bg-surface-container-low/40 p-md">
                    <p className="mb-sm text-label-sm font-label-sm uppercase tracking-wide text-outline">
                      Adjust points
                    </p>
                    <p className="mb-md text-body-sm font-body-sm text-on-surface-variant">
                      Current balance:{" "}
                      <span className="tabular-nums text-primary">
                        {user.pointsBalance.toLocaleString()}
                      </span>
                    </p>
                    <div className="grid gap-sm">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="admin-points-delta"
                          className="text-label-sm font-label-sm text-outline"
                        >
                          Adjustment (+ or −)
                        </label>
                        <input
                          id="admin-points-delta"
                          type="number"
                          inputMode="numeric"
                          value={form.pointsDelta}
                          onChange={(e) =>
                            setForm({ ...form, pointsDelta: e.target.value })
                          }
                          placeholder="0"
                          className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="admin-points-desc"
                          className="text-label-sm font-label-sm text-outline"
                        >
                          Reason
                        </label>
                        <input
                          id="admin-points-desc"
                          type="text"
                          value={form.pointsDescription}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              pointsDescription: e.target.value,
                            })
                          }
                          placeholder="Manual adjustment by admin"
                          className="rounded-xl border border-surface-variant/70 bg-surface px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                    </div>
                  </div>

                  {saveError && (
                    <p className="text-body-sm font-body-sm text-error">
                      {saveError}
                    </p>
                  )}
                </div>
              )}
    </SlideOverPanel>
  );
}

export default function AdminPointsPanel() {
  const [page, setPage] = useState(0);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const { data, isPending, isError, isFetching, refetch } = useAdminUsers(page);
  const deleteUser = useDeleteAdminUser();

  const users = data?.users ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const pageSize = data?.pageSize ?? DEFAULT_ADMIN_USERS_PAGE_SIZE;
  const rangeStart = totalCount === 0 ? 0 : page * pageSize + 1;
  const rangeEnd = Math.min((page + 1) * pageSize, totalCount);

  const openDetail = (user: AdminUser, mode: "view" | "edit") => {
    setDetailUserId(user.id);
    setDetailMode(mode);
  };

  const handleQuickDelete = async (user: AdminUser) => {
    try {
      await deleteUser.mutateAsync(user.id);
      setConfirmDeleteId(null);
      if (detailUserId === user.id) {
        setDetailUserId(null);
      }
    } catch {
      // Error surfaced via mutation if needed.
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-md"
      >
        <div className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-title-lg font-title-lg text-on-surface">
              Points & users
            </h2>
            <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
              View balances, adjust points, and manage user accounts.
            </p>
          </div>
          {totalCount > 0 && (
            <p className="text-label-sm font-label-sm text-outline">
              {rangeStart}–{rangeEnd} of {totalCount.toLocaleString()}
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 backdrop-blur-sm">
          <div className="hidden border-b border-surface-variant/50 bg-surface-container-low/60 px-md py-2.5 text-label-sm font-label-sm uppercase tracking-wide text-outline sm:grid sm:grid-cols-[1.4fr_5rem_5rem_6rem] sm:gap-sm">
            <span>User</span>
            <span>Role</span>
            <span className="text-right">Points</span>
            <span className="text-right">Actions</span>
          </div>

          {isPending && !data ? (
            <UsersSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center gap-sm p-xl text-center">
              <MaterialSymbol
                icon="error_outline"
                className="text-3xl text-on-surface-variant"
              />
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Could not load users.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-label-sm font-label-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <p className="p-xl text-center text-body-sm font-body-sm text-on-surface-variant">
              No users registered yet.
            </p>
          ) : (
            <ul
              className={`divide-y divide-surface-variant/50 ${isFetching ? "opacity-70" : ""}`}
            >
              {users.map((user) => {
                const isConfirming = confirmDeleteId === user.id;
                const isDeleting =
                  deleteUser.isPending && deleteUser.variables === user.id;
                const isSelf = user.id === currentUser?.id;

                return (
                  <li
                    key={user.id}
                    className="grid gap-2 p-md sm:grid-cols-[1.4fr_5rem_5rem_6rem] sm:items-center sm:gap-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-body-md font-body-md text-on-surface">
                        {user.fullName}
                        {isSelf ? (
                          <span className="ml-1.5 text-label-sm font-label-sm text-outline">
                            (you)
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-body-sm font-body-sm text-outline">
                        {user.isAdmin ? "Admin · " : ""}
                        Member since {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      {USER_ROLE_LABELS[user.role]}
                    </p>
                    <p className="text-right text-body-md font-body-md tabular-nums text-primary">
                      {user.pointsBalance.toLocaleString()}
                    </p>

                    {isConfirming ? (
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeleting}
                          className="rounded-lg px-2 py-1 text-label-sm font-label-sm text-outline hover:text-on-surface disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleQuickDelete(user)}
                          disabled={isDeleting}
                          className="rounded-lg bg-error px-2 py-1 text-label-sm font-label-sm text-on-error disabled:opacity-50"
                        >
                          {isDeleting ? "Removing…" : "Confirm"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openDetail(user, "view")}
                          aria-label={`Details for ${user.fullName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-variant/60 text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          <MaterialSymbol icon="info" className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDetail(user, "edit")}
                          aria-label={`Edit ${user.fullName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-variant/60 text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          <MaterialSymbol icon="edit" className="text-base" />
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(user.id)}
                            aria-label={`Remove ${user.fullName}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-variant/60 text-on-surface-variant transition-colors hover:border-error/30 hover:text-error"
                          >
                            <MaterialSymbol
                              icon="delete"
                              className="text-base"
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </motion.div>

      <UserDetailPanel
        userId={detailUserId}
        open={detailUserId !== null}
        initialMode={detailMode}
        onClose={() => setDetailUserId(null)}
        onDeleted={() => setDetailUserId(null)}
      />
    </>
  );
}
