fetch("MuC.json").then(response => response.json()).then(json => load(json));

const selects = document.getElementById("selectors")
const output = document.getElementById("code")

let MuC

const load = (MuCJson) => {
  console.log(JSON.stringify(MuC))

  MuC = MuCJson

  MuCJson.forEach(Catagory => {
    
    // Wrap and name
    let cataDiv = document.createElement("div")
    cataDiv.className = "catagory " + Catagory.type
    cataDiv.id = Catagory.name.replace(/[^a-zA-Z]/g, "")
    cataDiv.innerHTML = `<h2>${Catagory.name}</h2>`

    // options
    let optDiv = document.createElement("div")
    optDiv.className = "optDiv"
    optDiv.dataset.number = 0

    let optSelect = document.createElement("select")
    optSelect.className = "options"
    Catagory.options.forEach(optObject => {
      let opt = document.createElement("option")
      opt.innerText = Catagory.format.replace("tag", optObject.tag) + ": " + optObject.desc
      opt.value = optObject.tag

      optSelect.appendChild(opt)
    })
    optDiv.appendChild(optSelect)

    cataDiv.appendChild(optDiv)

    // Add and remove Options
    let addOpt = document.createElement("button")
    addOpt.innerText = "Add tag"

    addOpt.onclick = () => {
      let newOpt = addOpt.previousSibling.cloneNode(true)
      newOpt.dataset.number += 1
      cataDiv.insertBefore(newOpt, addOpt)
      initSelects()
    }

    let removeOpt = document.createElement("button")
    removeOpt.innerText = "Remove tag"

    removeOpt.onclick = () => {
      if (removeOpt.previousSibling.previousSibling.dataset.number !== "0") {
        removeOpt.previousSibling.previousSibling.remove()
        initSelects()
      }
    }

    if (Catagory.type == "checkbox") {
      cataDiv.appendChild(addOpt)
      cataDiv.appendChild(removeOpt)
    }

    // Mods
    if (Catagory.mods) {
      let modDiv = document.createElement("div")
      modDiv.className = "modDiv"

      Catagory.mods.unshift({
        tag: "",
        desc: "No Modifier"
      })

      let modSelect = document.createElement("select")
      modSelect.className = "mods"
      modSelect.dataset.number = 0
      Catagory.mods.forEach(modObject => {
        let mod = document.createElement("option")
        mod.innerText = (modObject.tag ? "/ " + modObject.tag + " /: " : "") + modObject.desc
        mod.value = modObject.tag
  
        modSelect.appendChild(mod)
      })

      modDiv.appendChild(modSelect)

      // Add / Remove modifiers
      let addMod = addOpt.cloneNode(true)
      let removeMod = removeOpt.cloneNode(true)

      addMod.onclick = () => {
        let newOpt = addMod.previousSibling.cloneNode(true)
        newOpt.dataset.number += 1
        modDiv.insertBefore(newOpt, addMod)
        initSelects()
      }

      removeMod.onclick = () => {
        if (removeMod.previousSibling.previousSibling.dataset.number !== "0") {
          removeMod.previousSibling.previousSibling.remove()
          initSelects()
        }
      }

      addMod.innerText = "Add Modifer"
      removeMod.innerText = "Remove Modifer"

      modDiv.appendChild(addMod)
      modDiv.appendChild(removeMod)

      optDiv.appendChild(modDiv)

    }

    selects.appendChild(cataDiv)

  })

  initSelects()
}

const initSelects = () => {
  document.querySelectorAll("select").forEach(e => { e.onchange = genCode })
  genCode()
}

const genCode = () => {

  let code = "MuC "

  MuC.forEach(Catagory => {

    let tags = ""

    document.querySelectorAll(`#${Catagory.name.replace(/[^a-zA-Z]/g, "")} .optDiv`).forEach(optDiv => {
      tags += optDiv.querySelector(".options").value
      optDiv.querySelectorAll(".mods").forEach(mod => { tags += mod.value })

      if (Catagory.name == "Species" && tags.slice(-1) == "~") {
        
      } else {
        tags += "/"
      }

    })

    tags = tags.replace(/\/$/, "")
    
    code += Catagory.format.replace("tag", tags)

  })

  output.value = code

}