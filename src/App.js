import React, { useEffect, useState } from 'react';
import "./styles/mainStyle.css"

const App = () => {
  const [rawData, getRawData] = useState();
  const [fixedData, setFixedData] = useState([]);

  const testaCPF = (strCPF) => {
    let Soma;
    let Resto;
    Soma = 0;
    if (strCPF === "00000000000") return false;

    for (let i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;

    return true;
  };

  const padronizeAllInputs = (rawDataParameters) => {
    if (rawDataParameters) {
      const nuValues = rawDataParameters.map((e) => {
        let nuObject = {}
  
        let splitName = e.name.toLowerCase().split(' ');
  
        splitName = splitName.map((name) => {
          return name.charAt(0).toUpperCase() + name.slice(1);;
        });
  
        const fixedName = splitName.join(' ');
        nuObject.name = fixedName
  
  
        /* acaba a lógica de name fixing */
  
        let rawPhoneNumber = e.phone
        let fixedNumber = ''
  
        for (let i = 0; i < rawPhoneNumber.length; i++) {
          if (!isNaN(Number(rawPhoneNumber[i])) && rawPhoneNumber[i] != ' ') {
            fixedNumber = fixedNumber+rawPhoneNumber[i]
          }
        }
  
        if(fixedNumber.length == 11) {
          fixedNumber = '+55' + fixedNumber
          
        } else {
          fixedNumber = '+' + fixedNumber
        }
        
        nuObject.phone = fixedNumber
  
        /*acaba aqui a lógica para arrumar numeros*/
  
        let rawCpfNumber = e.cpf
        let fixedCpfNumber = ''
  
        for (let i = 0; i < rawCpfNumber.length; i++) {
          if (!isNaN(Number(rawCpfNumber[i])) && rawCpfNumber[i] != ' ') {
            fixedCpfNumber = fixedCpfNumber+rawCpfNumber[i]
          }
        }
  
        const result = testaCPF(fixedCpfNumber)
  
        if(!result) {
          nuObject.cpf = 'Client provided an invalid CPF number'
        } else {
          nuObject.cpf = fixedCpfNumber
        }
  
        return nuObject;
      });
  
      setFixedData(nuValues)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/webhook/start-test/', {
          method: 'GET',
          headers: {
            'Authorization': 'teste-dev-ggv'
          }
        });

        const data = await response.json();
        getRawData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    padronizeAllInputs(rawData);
  }, [rawData]);

  const postValue = (data) => {
    const fixedFetchedData = {
      name: 'Adriano Araujo',
      email: 'araujoadriano95@gmail.com',
      phone: '51989234085',
      results: data
    };
  
    const jsonData = JSON.stringify(fixedFetchedData);
  
    const postData = async () => {
      try {
        await fetch('/webhook/submit-test/', {
          method: 'POST',
          headers: {
            'Authorization': 'teste-dev-ggv',
            'Content-Type': 'application/json'
          },
          body: jsonData
        })
        console.log('Postado');
      } catch (error) {
        console.log(error);
      }
    };
  
    postData();
  };
  
  

  return (
    <>
      {rawData ? (
      <>
      <div className='mainBody'>
          {rawData ? (
            <div>
              <h1>Dados originais</h1>
              {rawData.map((e) => (
                <ul key={e.id}>
                  <li>{e.name}</li>
                  <li>{e.phone}</li>
                  <li>{e.cpf}</li>
                </ul>
              ))}
            </div>
          ) : null}
          {fixedData ? (
            <div>
              <h1>Dados corrigidos</h1>
              {fixedData.map((e) => (
                <ul key={e.id}>
                  <li>{e.name}</li>
                  <li>{e.phone}</li>
                  <li>{e.cpf}</li>
                </ul>
              ))}
            </div>
          ) : null}
        </div>
      <button onClick={() => postValue(fixedData)}>Cadastrar informações corrigidas</button></>) : null}
      
    </>
  );
};

export default App;
