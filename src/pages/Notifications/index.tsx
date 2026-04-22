import { useState } from "react";
import axiosClient from "@/api/apiClient";
import { createNotificationApi } from "@/api/notificationApi";
import Input from "@/components/Form/Input";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";

const notificationApi = createNotificationApi(axiosClient);

type FormState = {
  title: string;
  body: string;
  screen: string; // optional deep-link target in mobile app
  orderId: string; // optional extra context
};

const initialState: FormState = {
  title: "",
  body: "",
  screen: "",
  orderId: "",
};

const NotificationsPage = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const handleChange = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    else if (form.title.length > 120) nextErrors.title = "Max 120 characters";
    if (!form.body.trim()) nextErrors.body = "Message body is required";
    else if (form.body.length > 500) nextErrors.body = "Max 500 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!validate()) return;

    const data: Record<string, string> = {};
    if (form.screen.trim()) data.screen = form.screen.trim();
    if (form.orderId.trim()) data.orderId = form.orderId.trim();

    setIsSending(true);
    try {
      await notificationApi.broadcast({
        title: form.title.trim(),
        body: form.body.trim(),
        data: Object.keys(data).length ? data : undefined,
      });
      setResult({
        type: "success",
        message: "Broadcast queued. All active users will receive it shortly.",
      });
      setForm(initialState);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send broadcast.";
      setResult({ type: "error", message: msg });
    } finally {
      setIsSending(false);
    }
  };

  const confirmAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  
    handleSubmit(e);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Send Notification
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Broadcast a push notification to all users with active devices.
        </p>
      </div>

      <form
        onSubmit={confirmAndSubmit}
        className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
      >
        <div>
          <Input
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
            error={errors.title}
            placeholder="e.g. Festival Offer Alert"
          />
          <p className="mt-1 text-xs text-gray-400">
            {form.title.length}/120
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Message Body
          </label>
          <textarea
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.body
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-orange-200"
              }`}
            rows={4}
            value={form.body}
            onChange={(e) => handleChange("body")(e.target.value)}
            placeholder="e.g. Flat 20% off on all pooja items — today only!"
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-500">{errors.body}</span>
            <span className="text-gray-400">{form.body.length}/500</span>
          </div>
        </div>

        {result && (
          <div
            className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${result.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
              }`}
          >
            {result.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => {
              setForm(initialState);
              setErrors({});
              setResult(null);
            }}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSending}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send to All Users"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsPage;
