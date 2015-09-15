function getUriParams(obj)
{
	return uriparams;
}

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
		resp.data = eval(ds.JSON); 
		return resp;
	}else{
		resp.success=false;
		resp.error = "No data";
		return resp;
	}
}


function getVat(obj)
{
  if (checkClientId(obj)){
		return sql2json('SELECT VAT,NAME,PERCNT,VATS1 FROM VAT WHERE ISACTIVE=1 ORDER BY VAT');
	} else {
	  return responseError(obj);
	}
}


function test(obj)
{
...
...
...
}