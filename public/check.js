function check(){
    var nameInput = document.getElementById('nameInput').value
    var ageInput = document.getElementById('ageInput').value
    var phoneInput = document.getElementById('phoneInput').value
    var gendor = -1
    var inlineRadioOptions = document.getElementsByName('gendor')

    if(inlineRadioOptions[0].checked==true)
        gendor = 1
    else if(inlineRadioOptions[1].checked==true)
        gendor = 0

    if(nameInput=="") {
        alert("이름을 입력해주세요")
        return false
    }
    else if(ageInput==""){
        alert("나이를 입력해주세요")
        return false
    }
    else if(phoneInput==""){
        alert("전화번호를 입력해주세요")
        return false
    }
    else if(gendor==-1){
        alert("성별을 선택해주세요")
        return false
    }
    else {
        alert("입력되었습니다")
        return true
    }
}