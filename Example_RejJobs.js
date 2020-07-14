function checkClientId(obj)
{
  try{
	  return ((obj.clientId) && (obj.clientId!=""));
	} catch(e){
     return false;	
	}
}

function sql2json(sql)
{
  var ds = X.GETSQLDATASET(sql, null);
  if (ds.RECORDCOUNT>0){
    return '{"success":true, "data":'+ds.JSON+'}';
  }else{
    return '{"success":false, "error":"No data"}';
  }
}

function getCancelSeries(aSoSource, aSeries)
{
  return s1p.Table('SERIES,SOSOURCE='+aSoSource,'SERIES',aSeries, 'CSERIES');
}

function getOld(obj, key)
{
	var ws = {};
	ws.SERVICE="getData";
	ws.OBJECT= obj;
	ws.KEY=key
	ws.appid=1000;
	ws.LOCATEINFO = "SRVLINES:LINENUM,MTRL,COMMENTS,DISC1PRC,LINEVAL,PRICE,QTY1,VAT,SPCS,PRCRULEDATA,MTRLINES,FINDOC;ITELINES:LINENUM,MTRL,COMMENTS,DISC1PRC,LINEVAL,PRICE,QTY1,VAT,SPCS,PRCRULEDATA,MTRLINES,FINDOC;"+obj+":FINDOC,SERIES,TRDR,SUMAMNT,VATAMNT,DISC1VAL,BOOL01,EXPN,NETAMNT,PAYMENT,PRJC,REMARKS";
	return JSON.parse(X.WEBREQUEST(JSON.stringify(ws)));
}

function setNew(obj, data)
{
	var ws = {};
	ws.SERVICE="setData";
	ws.OBJECT= obj;
	ws.FORM="worxs";
	ws.OBJECTPARAMS={};
	ws.OBJECTPARAMS.IMPORT=1;
	ws.KEY="";
	ws.appid=1000;
	ws.data=data;
	var rs = JSON.parse(X.WEBREQUEST(JSON.stringify(ws)));
	rs.ws = ws;
	return rs; 
}


function s1Transform(params)
{
  var rs ={};
  if (checkClientId(params))
	{
		var rs = getOld(params.obj, params.findoc)
		if (rs.success)
		{
		
			var data = rs.data;
			
			if (params.sosource==1351)
			{
			  data.SALDOC[0].SERIES=params.seriesto;
			  data.SALDOC[0].CONVMODE=1;
			} else
			{
			  data.PURDOC[0].SERIES=params.seriesto;
			  data.PURDOC[0].CONVMODE=1;
			}
			
			data.ITELINES.forEach(function(rec) {
				rec.FINDOCS   = rec.FINDOC;
				delete rec.FINDOC;
				rec.MTRLINESS = rec.MTRLINES;
				delete rec.MTRLINES;
			});		
			
			data.SRVLINES.forEach(function(rec) {
				rec.FINDOCS   = rec.FINDOC;
				delete rec.FINDOC;
				rec.MTRLINESS = rec.MTRLINES;
				delete rec.MTRLINES;
			});		
			
			
			
			return setNew(params.obj, data);
		}
	}
	return '{"success":false, "error":"Invalid cancel request"}';
}


function s1Cancel(params)
{
  var rs ={};
	rs.success = false;
  if (checkClientId(params))
	{
		var newSeries = getCancelSeries(params.sosource, params.series);
		if (newSeries!=0)
		{
			var rs = getOld(params.obj, params.findoc)
			if (rs.success)
			{
				var data = rs.data;
				if (params.sosource==1351)
				{
				  data.SALDOC[0].SERIES=newSeries;
  				data.SALDOC[0].CONVMODE=1;
  				data.SALDOC[0].ORIGIN=6;
  				data.SALDOC[0].FINDOCS=data.SALDOC[0].FINDOC;
				}else{
				  data.PURDOC[0].SERIES=newSeries;
  				data.PURDOC[0].CONVMODE=1;
  				data.PURDOC[0].ORIGIN=6;
  				data.PURDOC[0].FINDOCS=data.PURDOC[0].FINDOC;
				}
				
				data.ITELINES.forEach(function(rec) {
					rec.FINDOCS   = rec.FINDOC;
					delete rec.FINDOC;
					rec.MTRLINESS = rec.MTRLINES;
					delete rec.MTRLINES;
				});	

				data.SRVLINES.forEach(function(rec) {
					rec.FINDOCS   = rec.FINDOC;
					delete rec.FINDOC;
					rec.MTRLINESS = rec.MTRLINES;
					delete rec.MTRLINES;
				});		

				
			  return setNew(params.obj, data);
				
			} else rs.error = 'Δεν βρέθηκε το παραστατικό.';
		} else rs.error = 'Δεν έχετε ορίσει σειρά αντιλογισμού.';
	} else rs.error = 'Invalid request.';
	return rs;
}