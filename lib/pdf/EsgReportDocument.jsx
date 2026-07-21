import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EsgReportDocument — Laporan ESG per transaksi (FIX TUGAS 3)
 *
 * Dirender di server (Node, via renderToBuffer di route.js) — bukan di
 * browser — jadi komponen ini murni deklaratif @react-pdf/renderer, TIDAK
 * memakai className/Tailwind (tidak berlaku di PDF), melainkan StyleSheet
 * primitive milik react-pdf sendiri.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#1e293b", fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  brand: { fontSize: 18, fontWeight: 700, color: "#059669" },
  brandSub: { fontSize: 8, color: "#64748b", marginTop: 2 },
  reportTitle: { fontSize: 13, fontWeight: 700, textAlign: "right" },
  reportMeta: { fontSize: 8, color: "#64748b", textAlign: "right", marginTop: 2 },

  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 8, color: "#059669", textTransform: "uppercase" },

  infoGrid: { flexDirection: "row", flexWrap: "wrap" },
  infoCol: { width: "50%", marginBottom: 8 },
  infoLabel: { fontSize: 8, color: "#64748b" },
  infoValue: { fontSize: 10, fontWeight: 700, marginTop: 1 },

  table: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRowLast: { flexDirection: "row" },
  tableHeaderCell: { flex: 1, padding: 6, fontSize: 8, fontWeight: 700, backgroundColor: "#f1f5f9", color: "#334155" },
  tableCell: { flex: 1, padding: 6, fontSize: 9 },

  esgCard: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 6, padding: 14, marginTop: 4 },
  esgHeadline: { fontSize: 20, fontWeight: 700, color: "#047857" },
  esgSub: { fontSize: 9, color: "#065f46", marginTop: 2 },

  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 7, color: "#94a3b8", textAlign: "center", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8 },
});

function formatRp(n) {
  return `Rp ${Number(n ?? 0).toLocaleString("id-ID")}`;
}

function formatTgl(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * @param {object} props
 * @param {object} props.order       — Order (+ pembeli, items.produk, esgRecord, shipment)
 */
export default function EsgReportDocument({ order }) {
  const esg = order.esgRecord;
  const pembeli = order.pembeli;

  return (
    <Document title={`Laporan ESG - ${order.id}`} author="TaniPro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>🌱 TaniPro</Text>
            <Text style={styles.brandSub}>Platform Agrilogistik B2B — Laporan Dampak Lingkungan</Text>
          </View>
          <View>
            <Text style={styles.reportTitle}>Laporan ESG Transaksi</Text>
            <Text style={styles.reportMeta}>No. Pesanan: {order.id}</Text>
            <Text style={styles.reportMeta}>Diterbitkan: {formatTgl(new Date())}</Text>
          </View>
        </View>

        {/* Info Transaksi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Transaksi</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Perusahaan Pembeli</Text>
              <Text style={styles.infoValue}>{pembeli?.namaPerusahaan ?? "-"}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Tanggal Transaksi</Text>
              <Text style={styles.infoValue}>{formatTgl(order.createdAt)}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Total Berat Muatan</Text>
              <Text style={styles.infoValue}>{Number(order.totalBeratKg ?? 0).toLocaleString("id-ID")} kg</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Total Nilai Transaksi</Text>
              <Text style={styles.infoValue}>{formatRp(order.totalHarga)}</Text>
            </View>
          </View>
        </View>

        {/* Rekapitulasi Item */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Komoditas</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeaderCell}>Produk</Text>
              <Text style={styles.tableHeaderCell}>Jumlah (kg)</Text>
              <Text style={styles.tableHeaderCell}>Harga/kg</Text>
              <Text style={styles.tableHeaderCell}>Subtotal</Text>
            </View>
            {(order.items ?? []).map((item, i) => {
              const isLast = i === order.items.length - 1;
              return (
                <View key={item.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                  <Text style={styles.tableCell}>{item.produk?.nama ?? "-"}</Text>
                  <Text style={styles.tableCell}>{Number(item.jumlahKg).toLocaleString("id-ID")}</Text>
                  <Text style={styles.tableCell}>{formatRp(item.hargaUnit)}</Text>
                  <Text style={styles.tableCell}>{formatRp(item.subtotal)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Dampak ESG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Lingkungan (ESG)</Text>
          {esg ? (
            <>
              <View style={styles.esgCard}>
                <Text style={styles.esgHeadline}>
                  {Number(esg.co2eDisimpanKg).toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg CO₂e
                </Text>
                <Text style={styles.esgSub}>Total emisi karbon yang berhasil dihemat dari transaksi ini</Text>
              </View>

              <View style={[styles.infoGrid, { marginTop: 12 }]}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Emisi Aktual (TaniPro)</Text>
                  <Text style={styles.infoValue}>
                    {Number(esg.co2eEmisiKg).toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg CO₂e
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Baseline Konvensional</Text>
                  <Text style={styles.infoValue}>
                    {Number(esg.perbandinganBaseline).toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg CO₂e
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Jarak Tempuh</Text>
                  <Text style={styles.infoValue}>{Number(esg.jarakKm).toLocaleString("id-ID")} km</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Armada</Text>
                  <Text style={styles.infoValue}>{esg.fleetTipe}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 8, color: "#64748b", marginTop: 6 }}>
                Metodologi: {esg.metodologi}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 9, color: "#94a3b8" }}>
              Data ESG untuk transaksi ini belum tersedia.
            </Text>
          )}
        </View>

        <Text style={styles.footer}>
          Dokumen ini dihasilkan otomatis oleh sistem TaniPro dan sah tanpa tanda tangan basah.
          Estimasi CO₂e dihitung berdasarkan metodologi GHG Protocol Scope 3 — Category 4.
        </Text>
      </Page>
    </Document>
  );
}
