function checkClientId(obj)
{
  try{
	  return ((obj.clientID) && (obj.clientID!=""));
	} catch(e){
     return false;	
	}
}

function responseError(obj)
{
  var resp={}; 
  resp.success=false;
  resp.error = "Authenticate fails due to invalid credentials!";
  return resp;
}

function sql2json(sql)
{
  var resp={}; 
  var ds = X.GETSQLDATASET(sql, null);
	if (ds.RECORDCOUNT>0){
		resp.success=true;
		//resp.data = eval(ds.JSON); //delays and wasting memory
		resp.data = ds.JSON; 
		return resp;
	}else{
		resp.success=false;
		resp.error = "No data";
		return resp;
	}
}

function formatDateTime(dt)
{
	return "'" + dt.replace(new RegExp(":", 'g'), "' + CHAR(58) + '") + "'";
}


function getProducts(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT MTRL, CODE, NAME, NAME1, PRICEW, MTRUNIT1, MTRCATEGORY, MTRGROUP, MTRMARK, ISACTIVE FROM MTRL WHERE COMPANY=:X.SYS.COMPANY AND SODTYPE=51 AND MTRCATEGORY IS NOT NULL AND UPDDATE>="+formatDateTime(obj.UpdDate));
	} else {
		return responseError(obj);
	}
}

function getCustomers(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT T.TRDR, T.CODE, T.NAME, T.JOBTYPETRD, C.NAME as COUNTRY, T.PHONE01, T.PHONE02, T.ADDRESS, T.ZIP, T.CITY, T.IRSDATA, T.AFM, T.BRANCH FROM TRDR T LEFT JOIN COUNTRY C ON C.COUNTRY=T.COUNTRY WHERE COMPANY=:X.SYS.COMPANY AND T.UPDDATE>="+formatDateTime(obj.UpdDate));
	} else {
		return responseError(obj);
	}
}

function getCategories(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT MTRCATEGORY, COMPANY, SODTYPE, NAME, ISACTIVE FROM MTRCATEGORY WHERE COMPANY=:X.SYS.COMPANY AND SODTYPE=51 AND EXISTS (SELECT TOP 1 * FROM  UPDTBLS X  WHERE  MTRCATEGORY.COMPANY=X.COMPANY AND X.DBTBLNAME='MTRCATEGORY' AND X.UPDDATE>="+formatDateTime(obj.UpdDate)+")");
	} else {
		return responseError(obj);
	}
}

function getMtrmarks(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT MTRMARK, NAME, ISACTIVE FROM MTRMARK WHERE COMPANY=:X.SYS.COMPANY AND SODTYPE=51 AND EXISTS (SELECT TOP 1 * FROM  UPDTBLS X   WHERE  MTRMARK.COMPANY=X.COMPANY AND X.DBTBLNAME='MTRMARK' AND X.UPDDATE>="+formatDateTime(obj.UpdDate)+")");
	} else {
		return responseError(obj);
	}
}

function getMtrunits(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT MTRUNIT, NAME, ISACTIVE FROM MTRUNIT WHERE COMPANY=:X.SYS.COMPANY AND EXISTS (SELECT TOP 1 * FROM  UPDTBLS X   WHERE  MTRUNIT.COMPANY=X.COMPANY AND X.DBTBLNAME='MTRUNIT' AND X.UPDDATE>="+formatDateTime(obj.UpdDate)+")");
	} else {
		return responseError(obj);
	}
}

function getGroups(obj)
{
	if (checkClientId(obj)){
		return sql2json("SELECT MTRGROUP, NAME FROM MTRGROUP WHERE COMPANY=:X.SYS.COMPANY AND ISACTIVE=1 AND EXISTS (SELECT TOP 1 * FROM  UPDTBLS X WHERE MTRUNIT.COMPANY=X.COMPANY AND X.DBTBLNAME='MTRGROUP' AND X.UPDDATE>="+formatDateTime(obj.UpdDate)+")"); 
	} else {
		return responseError(obj);
	}
}

function getCompletedCustomerOrders(obj) 
{
	if (checkClientId(obj)){
		return sql2json("SELECT A.FINDOC,A.TRNDATE,A.FINCODE,C.CODE AS CUSTCODE,C.NAME AS CUSTNAME,C.SOCURRENCY,A.APPRV,ISNULL(A.SUMAMNT,0) AS SUMAMNT FROM FINDOC A LEFT OUTER JOIN TRDR C ON A.TRDR=C.TRDR WHERE A.COMPANY=:X.SYS.COMPANY AND A.SOSOURCE=1351 AND A.TRDR="+ obj.custID + " AND A.FPRMS=7022 AND A.FULLYTRANSF IN (1,2) AND A.UPDDATE>="+formatDateTime(obj.UpdDate));
	} else {
		return responseError(obj);
	}
}

