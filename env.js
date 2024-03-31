// import "./env.js";  to trigger

process.env.FT_JS="sftp://slava@happy.ia/home/slava/ia/scripts/js"
process.env.FT_LINK="sftp://slava@happy.ia/home/slava/ft/link"
process.env.FT_TMP="sftp://slava@happy.ia/home/slava/ft/system/tmp"
process.env.NODE_PATH="/home/slava/Documents/js_scripts/node_modules"

/**/
export function prod_server(index){
 switch (index){
// Server 1  
  case 1:
    process.env.PGUSER="s01"
    process.env.PGHOST="192.168.64.67"
    process.env.PGPASSWORD="s01"
    process.env.PGDATABASE="s01"
    process.env.PGPORT=5401
  return;
// Server 2  
  case 2:
    process.env.PGUSER="s02"
    process.env.PGHOST="192.168.64.65"
    process.env.PGPASSWORD="s02"
    process.env.PGDATABASE="s02"
    process.env.PGPORT=5402
  return;
// Server 3
  case 3:
    process.env.PGUSER="s03"
    process.env.PGHOST="192.168.64.67"
    process.env.PGPASSWORD="s03"
    process.env.PGDATABASE="s03"
    process.env.PGPORT=5403
  return;
// Server 4  
  case 4:
    process.env.PGUSER="s04"
    process.env.PGHOST="192.168.64.67"
    process.env.PGPASSWORD="s04"
    process.env.PGDATABASE="s04"
    process.env.PGPORT=5404
  return;
// Server 5
  case 5: 
    process.env.PGUSER="s05"
    process.env.PGHOST="192.168.64.67"
    process.env.PGPASSWORD="s05"
    process.env.PGDATABASE="s05"
    process.env.PGPORT=5405
  return;
  // Server 6
  case 6:
    process.env.PGUSER="s06"
    process.env.PGHOST="192.168.64.65"
    process.env.PGPASSWORD="s06"
    process.env.PGDATABASE="s06"
    process.env.PGPORT=5406
  return;
// Server 7
  case 7:
    process.env.PGUSER="s07"
    process.env.PGHOST="192.168.64.68"
    process.env.PGPASSWORD="s07"
    process.env.PGDATABASE="s07"
    process.env.PGPORT=5407
  return;
// Server 8  
case 8:
    process.env.PGUSER="s08"
    process.env.PGHOST="192.168.64.68"
    process.env.PGPASSWORD="s08"
    process.env.PGDATABASE="s08"
    process.env.PGPORT=5408
return;
// Server 9
  case 9:
    process.env.PGUSER="s09"
    process.env.PGHOST="192.168.64.55"
    process.env.PGPASSWORD="s09"
    process.env.PGDATABASE="s09"
    process.env.PGPORT=5409
  return;
// Server 10
  case 10:
    process.env.PGUSER="s10"
    process.env.PGHOST="192.168.64.69"
    process.env.PGPASSWORD="s10"
    process.env.PGDATABASE="s10"
    process.env.PGPORT=5410
  return;
// Server 11
  case 11:
    process.env.PGUSER="s11"
    process.env.PGHOST="sabra.ia"
    process.env.PGPASSWORD="s11"
    process.env.PGDATABASE="s11"
    process.env.PGPORT=5411
  return;
// Server 12
  case 12:
    process.env.PGUSER="s12"
    process.env.PGHOST="192.168.64.69"
    process.env.PGPASSWORD="s12"
    process.env.PGDATABASE="s12"
    process.env.PGPORT=5412
  return;
// Server 14
  case 14:
    process.env.PGUSER="s14"
    process.env.PGHOST="192.168.64.64"
    process.env.PGPASSWORD="s14"
    process.env.PGDATABASE="s14"
    process.env.PGPORT=5414
  return;
// Server 15
  case 15:
    process.env.PGUSER="s15"
    process.env.PGHOST="192.168.64.68"
    process.env.PGPASSWORD="s15"
    process.env.PGDATABASE="s15"
    process.env.PGPORT=5415
  return;
 };
};
//prod_server(12);

/** /
process.env.PGUSER="s01"
process.env.PGHOST="fig.ia"
process.env.PGPASSWORD="s01"
process.env.PGDATABASE="s01"
process.env.PGPORT=5435
/** /
process.env.PGUSER="s02"
process.env.PGHOST="papaya.ia"
process.env.PGPASSWORD="s02"
process.env.PGDATABASE="s02"
process.env.PGPORT=5433
/** /
process.env.PGUSER="s03"
process.env.PGHOST="fig.ia"
process.env.PGPASSWORD="s03"
process.env.PGDATABASE="s03"
process.env.PGPORT=5433
/** /
process.env.PGUSER="s04"
process.env.PGHOST="fig.ia"
process.env.PGPASSWORD="s04"
process.env.PGDATABASE="s04"
process.env.PGPORT=5436
/** /
process.env.PGUSER="s05"
process.env.PGHOST="sabra.ia"
process.env.PGPASSWORD="s05"
process.env.PGDATABASE="s05"
process.env.PGPORT=5436
/** /
process.env.PGUSER="s06"
process.env.PGHOST="papaya.ia"
process.env.PGPASSWORD="s06"
process.env.PGDATABASE="s06"
process.env.PGPORT=5406
/** /
process.env.PGUSER="s07"
process.env.PGHOST="melon.ia"
process.env.PGPASSWORD="s07"
process.env.PGDATABASE="s07"
process.env.PGPORT=5437
/** /
process.env.PGUSER="s08"
process.env.PGHOST="mango.ia"
process.env.PGPASSWORD="s08"
process.env.PGDATABASE="s08"
process.env.PGPORT=5434
/** /
process.env.PGUSER="s09"
process.env.PGHOST="lime.ia"
process.env.PGPASSWORD="s09"
process.env.PGDATABASE="s09"
process.env.PGPORT=5433
/** /
process.env.PGUSER="s10"
process.env.PGHOST="melon.ia"
process.env.PGPASSWORD="s10"
process.env.PGDATABASE="s10"
process.env.PGPORT=5438
/** /
process.env.PGUSER="s11"
process.env.PGHOST="sabra.ia"
process.env.PGPASSWORD="s11"
process.env.PGDATABASE="s11"
process.env.PGPORT=5433
/** /
process.env.PGUSER="s12"
process.env.PGHOST="aramis.ia"
process.env.PGPASSWORD="s12"
process.env.PGDATABASE="s12"
process.env.PGPORT=5412
/** /
process.env.PGUSER="s14"
process.env.PGHOST="melon.ia"
process.env.PGPASSWORD="s14"
process.env.PGDATABASE="s14"
process.env.PGPORT=5433
/** /
process.env.PGUSER="s15"
process.env.PGHOST="melon.ia"
process.env.PGPASSWORD="s15"
process.env.PGDATABASE="s15"
process.env.PGPORT=5436

/** /
process.env.PGUSER="s15"
process.env.PGHOST="melon.ia"
process.env.PGPASSWORD="s15"
process.env.PGDATABASE="s15"
process.env.PGPORT=5436
/**/
