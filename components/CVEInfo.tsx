"use client";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CVEInfoProps {
  product?: string;
  cveId?: string;
  cwe?: string;
  affectedVersions?: string[];
  fixedVersions?: string[];
  severity?: string;
  cvssScore?: number;
}

export default function CVEInfo({
  product,
  cveId,
  cwe,
  affectedVersions,
  fixedVersions,
  severity,
  cvssScore,
}: CVEInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-10 border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">{t("cve.info")}</h3>
      </div>
      <div className="p-6 bg-card">
        <p className="mb-4 text-muted-foreground">
          {t("cve.product")}{" "}
          <strong className="text-foreground">{product}</strong> {t("cve.id")}{" "}
          <strong className="text-foreground"> {cveId}</strong>.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="font-semibold min-w-[140px]">{t("cve.id")}:</span>
            <span className="text-primary font-medium">{cveId}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold min-w-[140px]">
              {t("cve.type")}:
            </span>
            <span>{cwe || "Unknown"}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold min-w-[140px]">
              {t("cve.affected")}:
            </span>
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
              {affectedVersions?.join(", ") || "N/A"}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold min-w-[140px]">
              {t("cve.patched")}:
            </span>
            <span className="font-mono bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded text-xs">
              {fixedVersions?.join(", ") || "N/A"}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold min-w-[140px]">
              {t("cve.severity")}:
            </span>
            <div className="flex items-center gap-2">
              <span
                className={
                  severity === "Critical"
                    ? "text-red-500 font-bold"
                    : "text-yellow-500 font-bold"
                }
              >
                {severity}
              </span>
              <span className="text-muted-foreground">({cvssScore})</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
