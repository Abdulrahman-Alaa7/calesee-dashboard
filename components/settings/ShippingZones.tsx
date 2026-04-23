"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { GET_SHIPPING_ZONES } from "../../graphql/actions/queries/settings/getShippingZones";
import { GET_SETTINGS } from "../../graphql/actions/queries/settings/getSettings";
import { UPSERT_SHIPPING_ZONE } from "../../graphql/actions/mutations/settings/upsertShippingZone";
import { DELETE_SHIPPING_ZONE } from "../../graphql/actions/mutations/settings/deleteShippingZone";

// Static list — lives only in the frontend, mirrored here for the dashboard UI
const GOVERNORATES = [
  { id: "1", en: "Cairo", ar: "القاهرة" },
  { id: "2", en: "Giza", ar: "الجيزة" },
  { id: "3", en: "Alexandria", ar: "الأسكندرية" },
  { id: "4", en: "Dakahlia", ar: "الدقهلية" },
  { id: "5", en: "Red Sea", ar: "البحر الأحمر" },
  { id: "6", en: "Beheira", ar: "البحيرة" },
  { id: "7", en: "Fayoum", ar: "الفيوم" },
  { id: "8", en: "Gharbiya", ar: "الغربية" },
  { id: "9", en: "Ismailia", ar: "الإسماعلية" },
  { id: "10", en: "Menofia", ar: "المنوفية" },
  { id: "11", en: "Minya", ar: "المنيا" },
  { id: "12", en: "Qaliubiya", ar: "القليوبية" },
  { id: "13", en: "New Valley", ar: "الوادي الجديد" },
  { id: "14", en: "Suez", ar: "السويس" },
  { id: "15", en: "Aswan", ar: "اسوان" },
  { id: "16", en: "Assiut", ar: "اسيوط" },
  { id: "17", en: "Beni Suef", ar: "بني سويف" },
  { id: "18", en: "Port Said", ar: "بورسعيد" },
  { id: "19", en: "Damietta", ar: "دمياط" },
  { id: "20", en: "Sharkia", ar: "الشرقية" },
  { id: "21", en: "South Sinai", ar: "جنوب سيناء" },
  { id: "22", en: "Kafr Al sheikh", ar: "كفر الشيخ" },
  { id: "23", en: "Matrouh", ar: "مطروح" },
  { id: "24", en: "Luxor", ar: "الأقصر" },
  { id: "25", en: "Qena", ar: "قنا" },
  { id: "26", en: "North Sinai", ar: "شمال سيناء" },
  { id: "27", en: "Sohag", ar: "سوهاج" },
];

const priceSchema = z.coerce.number().int().min(0, "Price must be 0 or more");

type ZoneMap = Record<string, number>; // governorate (EN) → price

const ShippingZones = () => {
  const { data: zonesData, loading: zonesLoading } =
    useQuery(GET_SHIPPING_ZONES);
  const { data: settingsData } = useQuery(GET_SETTINGS);

  const [upsertZone, { loading: upsertLoading }] = useMutation(
    UPSERT_SHIPPING_ZONE,
    {
      refetchQueries: [{ query: GET_SHIPPING_ZONES }],
    },
  );
  const [deleteZone, { loading: deleteLoading }] = useMutation(
    DELETE_SHIPPING_ZONE,
    {
      refetchQueries: [{ query: GET_SHIPPING_ZONES }],
    },
  );

  // Local price inputs — keyed by English governorate name
  const [prices, setPrices] = useState<Record<string, string>>({});
  // Track which rows have unsaved changes
  const [dirty, setDirty] = useState<Record<string, boolean>>({});

  const defaultPrice: number =
    settingsData?.getSettings?.[0]?.defaultShippingPrice ?? 0;

  // Build a map of saved zones once data arrives
  const savedZones: ZoneMap = React.useMemo(() => {
    const map: ZoneMap = {};
    (zonesData?.getShippingZones ?? []).forEach((z: any) => {
      map[z.governorate] = z.price;
    });
    return map;
  }, [zonesData]);

  // Pre-fill inputs from saved zones
  useEffect(() => {
    const initial: Record<string, string> = {};
    GOVERNORATES.forEach((g) => {
      initial[g.en] =
        savedZones[g.en] !== undefined ? String(savedZones[g.en]) : "";
    });
    setPrices(initial);
    setDirty({});
  }, [savedZones]);

  const handleChange = (govEn: string, value: string) => {
    setPrices((prev) => ({ ...prev, [govEn]: value }));
    setDirty((prev) => ({ ...prev, [govEn]: true }));
  };

  const handleSave = async (govEn: string) => {
    const raw = prices[govEn];
    const parsed = priceSchema.safeParse(raw === "" ? undefined : raw);
    if (!parsed.success) {
      toast.error(
        `Invalid price for ${govEn}: ${parsed.error.issues[0].message}`,
      );
      return;
    }
    try {
      await upsertZone({
        variables: { governorate: govEn, price: parsed.data },
      });
      setDirty((prev) => ({ ...prev, [govEn]: false }));
      toast.success(`Saved: ${govEn} → ${parsed.data} EGP`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReset = async (govEn: string) => {
    if (savedZones[govEn] === undefined) return;
    try {
      await deleteZone({ variables: { governorate: govEn } });
      setPrices((prev) => ({ ...prev, [govEn]: "" }));
      setDirty((prev) => ({ ...prev, [govEn]: false }));
      toast.success(`${govEn} reset to default (${defaultPrice} EGP)`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isBusy = upsertLoading || deleteLoading;

  return (
    <Card className="fadeRight">
      <CardHeader>
        <CardTitle className="text-[18px] md:text-[22px]">
          Shipping Price per Governorate
        </CardTitle>
        <CardDescription>
          Set a custom shipping price per governorate. Leave blank to use the
          default ({defaultPrice} EGP).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {zonesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {GOVERNORATES.map((gov) => {
              const isCustomized = savedZones[gov.en] !== undefined;
              const isDirty = dirty[gov.en];

              return (
                <div
                  key={gov.id}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                    isCustomized
                      ? "border-primary/60 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="w-full mb-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm font-medium truncate">
                        {gov.en}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        ({gov.ar})
                      </span>
                      {isCustomized && (
                        <Badge
                          variant="default"
                          className="text-[10px] h-5 px-1 shrink-0"
                        >
                          Custom
                        </Badge>
                      )}
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={prices[gov.en] ?? ""}
                      onChange={(e) => handleChange(gov.en, e.target.value)}
                      placeholder={`Default: ${defaultPrice}`}
                      className="h-10 text-sm"
                      disabled={isBusy}
                    />
                  </div>
                  <div className="flex items-center  gap-1 shrink-0 ml-auto">
                    <Button
                      size="sm"
                      className="h-8 text-xs px-3 rounded-full"
                      onClick={() => handleSave(gov.en)}
                      disabled={isBusy || (!isDirty && !isCustomized)}
                    >
                      Save
                    </Button>
                    {isCustomized && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs px-3 text-muted-foreground rounded-full"
                        onClick={() => handleReset(gov.en)}
                        disabled={isBusy}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingZones;
