function isEmpty(str) {
    return (!str || 0 === str.length);
}
function isPosInt(val) {
    return Number.isInteger(val) && val > 0;
}

function showUpdateForm(id, name, reps, weight, unit) {
  document.getElementById("box").style.visibility="";
  document.getElementById("upId").value = id;
  document.getElementById("upName").value = name;
  document.getElementById("upReps").value = reps;
  document.getElementById("upWeight").value = weight;
  document.getElementById("upUnit").value = unit;
  document.getElementById("updateForm").style.visibility="";
}

function update() 
{
        var req = new XMLHttpRequest();
        var url = "/";
        var postBody =
        {
            "op": "update",
            "id": null,
            "name": null,
            "reps":  null,
            "weight":  null,
            "unit":  null
        };
        
        postBody.id = document.getElementById("upId").value;
        postBody.name = document.getElementById("upName").value;
        postBody.reps = parseInt(document.getElementById("upReps").value);
        postBody.weight = parseInt(document.getElementById("upWeight").value);
        postBody.unit = document.getElementById("upUnit").value;
        
        if (isEmpty(postBody.name)) {
          alert("Name cannot be empty");
          return;
        }
        if (postBody.name.length > 255) {
          alert("Name cannot be longger than 255.");
          return;
        }
        if (!isPosInt(postBody.reps)) {
          alert("Reps must be integer");
          return;
        }
        if (!isPosInt(postBody.weight)) {
          alert("Weight must be integer");
          return;
        }

        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load",function(){
            if(req.status >= 200 && req.status < 400)
            {
              console.log(req.responseText);
              var response = JSON.parse(req.responseText);
              if (response.status == "success") {
                document.getElementById("updateForm").style.visibility="hidden";
                document.getElementById("box").style.visibility="hidden";
                alert("Update successfully.");
                updatedRow = "<td>" + response.data.name + "</td><td>" + response.data.reps + "</td><td>" + response.data.weight + "</td><td>" + response.data.date + "</td><td>" + response.data.unit + "</td><td><input type=\"button\" name=\"update\" value=\"update\" onclick=\"showUpdateForm(" + response.data.id + ",'" + response.data.name + "'," + response.data.reps + "," + response.data.weight + ",'" + response.data.unit + "')\"></td><td><input type=\"button\" name=\"delete\" value=\"delete\" onclick=\"deleteById(" + response.data.id + ")\"></td>"
                document.getElementById("item_" + postBody.id).innerHTML = updatedRow;

              }
            }
            else
            {
                alert("Request Error. Please try again." + response.message);
            }
        });
        
        req.send(JSON.stringify(postBody));                  //Send the request 
        
}



function deleteById(id)
{
  var req = new XMLHttpRequest();
  var url = "/";
  var postBody =
  {
    "id": id,
    "op": "delete"
  }
  req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load",function(){
            if(req.status >= 200 && req.status < 400)
            {
              console.log(req.responseText);
              var response = JSON.parse(req.responseText);
              if (response.status == "success") {
                alert("Delete successfully.");
                var ele = document.getElementById("item_" + id);
                ele.parentNode.removeChild(ele);
              }
            }
            else
            {
                alert("Request Error. Please try again." + response.message);
            }
        });
        
        req.send(JSON.stringify(postBody));                  //Send the request 

}


function insert() 
{
        var req = new XMLHttpRequest();
        var url = "/";
        var postBody =
        {
            "op": "insert",
            "name": null,
            "reps":  null,
            "weight":  null,
            "unit":  null
        };
        
        postBody.name = document.getElementById("myName").value;
        postBody.reps = parseInt(document.getElementById("myReps").value);
        postBody.weight = parseInt(document.getElementById("myWeight").value);
        postBody.unit = document.getElementById("myUnit").value;
        
        if (isEmpty(postBody.name)) {
          alert("Name cannot be empty");
          return;
        }
        if (postBody.name.length > 255) {
          alert("Name cannot be longger than 255.");
          return;
        }
        if (!isPosInt(postBody.reps)) {
          alert("Reps must be integer");
          return;
        }
        if (!isPosInt(postBody.weight)) {
          alert("Weight must be integer");
          return;
        }
        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load",function(){
            if(req.status >= 200 && req.status < 400)
            {
              console.log(req.responseText);
              var response = JSON.parse(req.responseText);
              if (response.status == "success") {
                alert("Insert successfully.");
                newRow = "<tr id=\"item_" + response.data.id + "\"><td>" + response.data.name + "</td><td>" + response.data.reps + "</td><td>" + response.data.weight + "</td><td>" + response.data.date + "</td><td>" + response.data.unit + "</td><td><input type=\"button\" name=\"update\" value=\"update\" onclick=\"showUpdateForm(" + response.data.id + ",'" + response.data.name + "'," + response.data.reps + "," + response.data.weight + ",'" + response.data.unit + "')\"></td><td><input type=\"button\" name=\"delete\" value=\"delete\" onclick=\"deleteById(" + response.data.id + ")\"></td></tr>"
                document.getElementById("dataTable").innerHTML = document.getElementById("dataTable").innerHTML + newRow;
              }
            }
            else
            {
                alert("Request Error. Please try again." + response.message);
            }
        });
        
        req.send(JSON.stringify(postBody));                  //Send the request 
        
}