import sqlite3

ids_dict_list = [
    {"id": "300413572"},
    {"id": "311573935"},
    {"id": "325222966"},
    {"id": "319098950"},
    {"id": "209008580"},
    {"id": "215563578"},
    {"id": "325223931"},
    {"id": "200905164"},
    {"id": "311245203"},
    {"id": "317979276"},
    {"id": "203393202"},
    {"id": "850676289"},
    {"id": "914455860"},
    {"id": "932157266"},
    {"id": "904132255"},
    {"id": "988550265"},
    {"id": "902852649"},
    {"id": "901058479"},
    {"id": "850021775"},
    {"id": "906289939"},
    {"id": "322316761"},
    {"id": "204341432"},
    {"id": "304773237"},
    {"id": "201133444"},
    {"id": "322921701"},
    {"id": "201498342"},
    {"id": "317709897"},
    {"id": "317709863"},
    {"id": "208034389"},
    {"id": "300476173"},
    {"id": "212794218"},
    {"id": "211401351"},
    {"id": "200593556"},
    {"id": "315409664"},
    {"id": "200203180"},
    {"id": "326100419"},
    {"id": "215728403"},
    {"id": "304702459"},
    {"id": "208998989"},
    {"id": "216249672"},
    {"id": "208998989"},
    {"id": "208734962"},
    {"id": "301839882"},
    {"id": "314057183"},
    {"id": "334016730"},
    {"id": "314057175"},
    {"id": "203939418"},
    {"id": "303102909"},
    {"id": "322674839"},
    {"id": "312294028"},
    {"id": "203990510"},
    {"id": "203437918"},
    {"id": "207098427"},
    {"id": "206985541"},
    {"id": "214622508"},
    {"id": "305248585"},
    {"id": "209080923"},
    {"id": "307856765"},
    {"id": "324210657"},
    {"id": "200836310"},
    {"id": "302480397"},
    {"id": "208723338"},
    {"id": "207526559"},
    {"id": "331559484"},
    {"id": "332783984"},
    {"id": "211875638"},
    {"id": "316493840"},
    {"id": "315524561"},
    {"id": "328162722"},
    {"id": "203909742"},
    {"id": "203909742"},
    {"id": "206150146"},
    {"id": "324034859"},
    {"id": "204523278"},
    {"id": "300265055"},
    {"id": "200581353"},
    {"id": "214746208"},
    {"id": "315766154"},
    {"id": "313393019"},
    {"id": "305124513"},
    {"id": "213020928"},
    {"id": "313633208"},
    {"id": "216439091"},
    {"id": "313633216"},
    {"id": "313393803"},
    {"id": "308147024"},
    {"id": "212459101"},
    {"id": "318709037"},
    {"id": "312476237"},
    {"id": "214530297"},
    {"id": "207249723"},
    {"id": "325355717"},
    {"id": "324263789"},
    {"id": "208708453"},
    {"id": "204450902"},
    {"id": "313833337"},
    {"id": "312320781"},
    {"id": "321578882"},
    {"id": "301400891"},
    {"id": "316516228"},
    {"id": "313428930"},
    {"id": "201302163"},
    {"id": "211884051"},
    {"id": "315395772"},
    {"id": "327893129"},
    {"id": "316549252"},
    {"id": "321697674"},
    {"id": "304969967"},
    {"id": "313373169"},
    {"id": "322699943"},
    {"id": "325405207"},
    {"id": "327886479"},
    {"id": "211881495"},
    {"id": "315469015"},
    {"id": "212674899"},
    {"id": "312433402"},
    {"id": "322820879"},
    {"id": "322820879"},
    {"id": "326803905"},
    {"id": "313955320"},
    {"id": "215202482"},
    {"id": "300403284"},
    {"id": "200805430"},
    {"id": "315524900"},
    {"id": "300869575"},
    {"id": "209142330"},
    {"id": "207554999"},
    {"id": "314873688"},
    {"id": "326620077"},
    {"id": "201153327"},
    {"id": "203260856"},
    {"id": "327892964"},
    {"id": "206273070"},
    {"id": "302536156"},
    {"id": "209339548"},
    {"id": "301642583"},
    {"id": "315765859"},
    {"id": "203675988"},
    {"id": "203049202"},
    {"id": "321575409"},
    {"id": "216724625"},
    {"id": "312206204"},
    {"id": "209285774"},
    {"id": "318295847"},
    {"id": "318516366"},
    {"id": "311250971"},
    {"id": "200660199"},
    {"id": "308083716"},
    {"id": "332245018"},
    {"id": "410242184"},
    {"id": "859532038"},
    {"id": "941293060"},
    {"id": "406692228"},
    {"id": "922364302"},
    {"id": "403926116"},
    {"id": "984634105"},
    {"id": "853073161"},
    {"id": "907894729"},
    {"id": "407629211"},
    {"id": "404889115"},
    {"id": "933106288"},
    {"id": "911693158"},
    {"id": "904437779"},
    {"id": "948965751"},
    {"id": "904594710"},
    {"id": "402101000"},
    {"id": "854450053"},
    {"id": "955690706"},
    {"id": "412145500"},
    {"id": "406498840"},
    {"id": "902321637"},
    {"id": "859817967"},
    {"id": "988666939"},
    {"id": "401131040"},
    {"id": "942293184"},
    {"id": "859670473"},
    {"id": "946462603"},
    {"id": "405299793"},
    {"id": "404892788"},
    {"id": "947815379"},
    {"id": "402632079"},
    {"id": "420663205"},
    {"id": "420684904"},
    {"id": "853552404"},
    {"id": "403902109"},
    {"id": "404444226"},
    {"id": "960615508"},
    {"id": "936617901"},
    {"id": "407247998"},
    {"id": "853655868"},
    {"id": "946053717"},
    {"id": "852474642"},
    {"id": "900133729"},
    {"id": "950341735"},
    {"id": "401005590"},
    {"id": "854523743"},
    {"id": "214638686"},
    {"id": "988164661"},
    {"id": "904132255"},
    {"id": "405044140"},
    {"id": "850883406"},
    {"id": "911505154"},
    {"id": "408908432"},
    {"id": "408275311"},
    {"id": "929123156"},
    {"id": "853579100"},
    {"id": "929123180"},
    {"id": "938097904"},
    {"id": "973635279"},
    {"id": "850377748"},
    {"id": "909855744"},
    {"id": "859799926"},
    {"id": "854927332"},
    {"id": "853692424"},
    {"id": "407555754"},
    {"id": "404086829"},
    {"id": "850729161"},
    {"id": "405739327"},
    {"id": "408596104"},
    {"id": "406739110"},
    {"id": "406391565"},
    {"id": "906137252"},
    {"id": "992530352"},
    {"id": "411012149"},
    {"id": "854825569"},
    {"id": "407658590"},
    {"id": "997057435"},
    {"id": "405620634"},
    {"id": "405020504"},
    {"id": "906144464"},
    {"id": "854705357"},
    {"id": "401444757"},
    {"id": "968600262"},
    {"id": "407548163"},
    {"id": "946641776"},
    {"id": "406386656"},
    {"id": "859822470"},
    {"id": "410805113"},
    {"id": "409085842"},
    {"id": "406251603"},
    {"id": "905019535"},
    {"id": "407309095"},
    {"id": "408170611"},
    {"id": "860081504"},
    {"id": "408345759"},
    {"id": "305136723"},
    {"id": "206295834"},
    {"id": "406606608"},
    {"id": "904461241"},
    {"id": "936533876"},
    {"id": "853852275"},
    {"id": "854730637"},
    {"id": "403392012"},
    {"id": "907113153"},
    {"id": "900456047"},
    {"id": "904978467"},
    {"id": "986446250"},
    {"id": "402633200"},
    {"id": "409083110"},
    {"id": "408212462"},
    {"id": "407336254"},
    {"id": "853220689"},
    {"id": "409871845"},
    {"id": "404933905"},
    {"id": "408890952"},
    {"id": "408916997"},
    {"id": "946642709"},
    {"id": "853414712"},
    {"id": "403911159"},
    {"id": "207706904"},
    {"id": "215710104"},
    {"id": "204316764"},
    {"id": "201408754"},
    {"id": "203351689"},
    {"id": "314826140"},
    {"id": "1000"},
]

# Extract id values into a list
ids_to_delete = [d["id"] for d in ids_dict_list]
print(ids_to_delete)

db_path = '/Users/razbuxboim/Desktop/Halbitza/excel_data_new.db' 

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Prepare the DELETE statement
query = f"DELETE FROM persons WHERE id IN ({','.join('?' for _ in ids_to_delete)})"

# Execute the DELETE statement
cursor.execute(query, ids_to_delete)

# Commit the changes
conn.commit()

# Close the connection
conn.close()

print(f"Deleted {cursor.rowcount} rows from the persons table.")
