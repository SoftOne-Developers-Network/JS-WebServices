
function getDataSetFieldValue(mSQL, dtName, recNo, fldNo)
{ 
	var dbuf = mSQL.DataBufs(dtName);
	if (dbuf.COUNT>0)
	{
		return dbuf(recNo, fldNo);
	} else {
	  return '';
	}
}

function getDataSetData(mSQL, dtName)
{ 
	var ds = mSQL.DataSets(dtName);
    return ds.JSON;
}


function getData()
{

  var fyDate = s1p.FormatDateTime('yyyy/mm/dd',s1p.FirstPeriodDate(s1p.YearOfDate(s1p.LoginDate),1));
	
	var mSQL = X.MULTISQL();
	mSQL.AddSQL("DT1", X.RESOLVE('SELECT TOP 10 A.NAME, ISNULL(B.LBAL,0) AS VALUE FROM TRDR A LEFT OUTER JOIN TRDFINDATA B ON B.COMPANY=:X.SYS.COMPANY AND B.TRDR=A.TRDR  WHERE A.COMPANY=:X.SYS.COMPANY AND A.SODTYPE=13 AND A.ISACTIVE=1  ORDER BY 2 DESC;'));
	mSQL.AddSQL("DT2", X.RESOLVE("SELECT TOP 10 A.NAME, ISNULL((SELECT SUM(SALVAL) FROM MTRBALSHEET WHERE MTRL=A.MTRL AND COMPANY=:X.SYS.COMPANY AND PERIOD>0 AND PERIOD<1000),0) AS VALUE FROM MTRL A WHERE A.COMPANY=:X.SYS.COMPANY AND A.SODTYPE=52  ORDER BY 2 DESC;"));
	mSQL.AddSQL("DT3", X.RESOLVE("SELECT B.NAME AS NAME, SUM(A.SUMAMNT) AS VALUE FROM FINDOC A, SERIES B WHERE A.COMPANY=:X.SYS.COMPANY AND A.SOSOURCE=1351 AND A.COMPANY=B.COMPANY AND B.SOSOURCE=A.SOSOURCE AND A.SERIES=B.SERIES GROUP BY B.NAME ORDER BY 2 DESC;"));
	mSQL.AddSQL("CT1", X.RESOLVE("SELECT COUNT(*) AS CNT, SUM(B.LBAL) AS VALUE FROM TRDR A LEFT OUTER JOIN  TRDFINDATA B ON B.COMPANY=A.COMPANY AND B.TRDR=A.TRDR WHERE SODTYPE=13 AND A.COMPANY=:X.SYS.COMPANY;"));
	mSQL.AddSQL("CT2", X.RESOLVE("SELECT COUNT(*) AS CNT, SUM(B.SALVAL) AS VALUE FROM MTRL A LEFT OUTER JOIN   MTRBALSHEET B ON B.COMPANY=A.COMPANY AND B.MTRL=A.MTRL AND PERIOD>0 AND PERIOD<1000 WHERE SODTYPE=52 AND A.COMPANY=:X.SYS.COMPANY;"));
	mSQL.AddSQL("CT3", X.RESOLVE("SELECT COUNT(*) AS CNT, SUM(SUMAMNT) AS VALUE FROM FINDOC WHERE SOSOURCE=1351 AND COMPANY=:X.SYS.COMPANY AND TRNDATE>='"+fyDate+"';"));
	mSQL.Execute;
	

    var rs = {}
	
	rs.date = fyDate;
	
	rs.customers ={};
	rs.customers.title = 'Πελάτες';
	rs.customers.count = getDataSetFieldValue(mSQL, "CT1", 0, 0);
	rs.customers.total = getDataSetFieldValue(mSQL, "CT1", 0, 1);
	rs.customers.data = JSON.parse(getDataSetData(mSQL, "DT1"));
	
	rs.items ={};
	rs.items.title = 'Υπηρεσίες';
	rs.items.count = getDataSetFieldValue(mSQL, "CT2", 0, 0);
	rs.items.total = getDataSetFieldValue(mSQL, "CT2", 0, 1);
	rs.items.data = JSON.parse(getDataSetData(mSQL, "DT2"));
	
	rs.sales ={};
	rs.sales.title = 'Παραστατικά';
	rs.sales.count = getDataSetFieldValue(mSQL, "CT3", 0, 0);
	rs.sales.total = getDataSetFieldValue(mSQL, "CT3", 0, 1);
	rs.sales.data = JSON.parse(getDataSetData(mSQL, "DT3"));
	return rs;
}
