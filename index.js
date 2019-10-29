const { query } = require('./config/database');

async function getTagihan() {
  let sql_query = `SELECT 
    siswa.id as id_siswa, 
    sekolah.nama as nama_sekolah,
    kelas.nama as nama_kelas,
    kelas.jenis as tingkat,
    tahunajaran.nama as nama_tahunajaran, 
    program.nama as nama_program, 
    siswa.nama_lengkap as nama_lengkap, 
    sum(tagihan_detail.jumlah) as total_tagihan 
FROM 
    tagihan 
    join tagihan_detail on tagihan.id = tagihan_detail.id_tagihan 
    join siswa_kelas on tagihan.siswa_kelas = siswa_kelas.id 
    join siswa on siswa_kelas.id_siswa = siswa.id 
    join sekolah_kelas on siswa_kelas.id_sekolah_kelas = sekolah_kelas.id 
    join sekolah on sekolah_kelas.id_sekolah = sekolah.id 
    join kelas on sekolah_kelas.id_kelas = kelas.id 
    join program on sekolah_kelas.program = program.id    
    join tahunajaran on sekolah_kelas.tahun_ajaran = tahunajaran.id 
    left join pembayaran on tagihan.id_pembayaran = pembayaran.id 
WHERE 
    tagihan.status = "ACTIVE" 
AND 
    tagihan.jenis_tagihan = "SEKOLAH" 
AND 
    tagihan.jatuh_tempo < now() 
AND 
    siswa_kelas.status = "AKTIF" 
AND ( pembayaran.status != "PAID" OR pembayaran.id is null ) 
GROUP by siswa.id`;

  let dataList = await query(sql_query);

  return dataList;
}

async function getData() {
  let dataList = await getTagihan();
  console.log(dataList);
}

getData();
