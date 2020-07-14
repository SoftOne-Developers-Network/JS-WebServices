function main(params)
{
    //1. MULTISQL - Execute many sql in one statement
	var mSQL = X.MULTISQL();
	mSQL.AddSQL("DT1", X.RESOLVE('SELECT A.TRDR, A.NAME, A.ISACTIVE, A.ISPROSP, A.DISTRICT, ISNULL(B.LBAL,0) AS BALANCE FROM TRDR A LEFT OUTER JOIN TRDFINDATA B ON B.COMPANY=:X.SYS.COMPANY AND B.TRDR=A.TRDR WHERE A.COMPANY=:X.SYS.COMPANY AND A.SODTYPE=13 AND A.ISACTIVE=1 ORDER BY A.CODE,A.TRDR'));
	mSQL.AddSQL("DT2", X.RESOLVE("SELECT A.MTRL, A.CODE,A.NAME,A.VAT,A.MTRUNIT1,ISNULL(B.QTY1,0) AS QTY1 FROM MTRL A LEFT OUTER JOIN MTRDATA B ON B.COMPANY=:X.SYS.COMPANY AND A.MTRL=B.MTRL AND B.FISCPRD=2018 WHERE A.COMPANY=:X.SYS.COMPANY AND A.SODTYPE=51 ORDER BY A.CODE,A.MTRL"));
	mSQL.Execute;
	
	//2. DataSets('DT1') - Access DataSet from multiSql
	var dt1 = mSQL.DataSets('DT1');
	//3. Sum method
    var bal = dt1.Sum('BALANCE', "DISTRICT LIKE 'Καλλιθέ*'");
	
	
	//4. DataSets('DT1') - Access DataBuf from multiSql
	var dbuf = mSQL.Databufs('DT1');
    var trdr1=dbuf(0,0);
	var trdr2=dbuf(0,1); //dbuf(recNo, fldNo);
	
	var str='';
	dt1.first;
	while (!dt1.EOF) {
      str+=dt1.Name;
      dt1.Next;	  
    }
	
	var dt2 = mSQL.DataSets('dt2');
    var qty = dt2.Sum('QTY1', '');
	
	var result = {};
	result.test = "Test : Ελληνικα";
	result.balance = bal;
	result.qty  = qty;
	result.name = str;
	result.trdrs = trdr1 + ' - '+ trdr2;
	
	//5. s1p - Access all tnternal Soft1 parser functions (Local fields functions)
	result.parserdata = s1p.string(s1p.companycode) + '-6-' + s1p.string(s1p.loginyear);
	return result;
}