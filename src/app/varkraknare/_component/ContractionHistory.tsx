"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowLeft, Droplet, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryContractionSessions } from "../_api/queries/useQueryContraction";
import { useDeleteContractionSession } from "../_api/mutations/useContractionMutations";
import { fmtDuration } from "../_lib/format";

export default function ContractionHistory({
  onBack,
  onViewStats,
}: {
  onBack: () => void;
  onViewStats: () => void;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQueryContractionSessions(page);
  const del = useDeleteContractionSession();

  const sessions = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to Contraction Counter
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold text-primary-dark">
              Session History
            </h2>
            <p className="text-sm text-text-secondary">
              Review all your past contraction-tracking sessions
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-10 text-center text-sm text-text-secondary">
              No sessions recorded yet.
            </Card>
          ) : (
            sessions.map((s) => (
              <Card key={s._id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary-light">
                      <Droplet className="size-4 text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-primary-dark">
                        {s.total_count} Contractions
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(s.started_at).toLocaleString("sv-SE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      del.mutate(s._id, {
                        onSuccess: () => toast.success("Session deleted"),
                      })
                    }
                    className="text-text-secondary hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-center">
                  <Mini label="Avg Duration" value={fmtDuration(s.avg_duration_sec)} />
                  <Mini label="Avg Interval" value={fmtDuration(s.avg_interval_sec)} />
                  <Mini label="Total Count" value={String(s.total_count)} />
                </div>
              </Card>
            ))
          )}

          {(data?.pagination.last_page ?? 1) > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= (data?.pagination.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-primary-dark">Summary</h3>
            <div className="space-y-3 text-sm">
              <Row label="Total Sessions" value={total} />
              <Row
                label="Total Contractions"
                value={sessions.reduce((a, s) => a + s.total_count, 0)}
              />
            </div>
            <Button onClick={onViewStats} className="mt-5 w-full justify-center">
              View Full Stats
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-primary-dark">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-lg font-semibold text-primary-dark">{value}</span>
    </div>
  );
}
