import { useEffect, useState } from 'react';

const InformBased = () => {

    const [mhFrom, setMhFrom] = useState();
    const [mssTo, setMssTo] = useState();
    const [mhReqToken, setMhReqToken] = useState();
    const [mssTurn, setMssTurn] = useState(0);
    const [data, setData] = useState(
        [{name: "MSS1", mobilehosts: ['mh1', 'mh2'],
        reqQ: [],
        grantQ: []}, 
        {name: "MSS2",mobilehosts: ['mh3', 'mh4'],
        reqQ: [],
        grantQ: []}, 
        {name: "MSS3",mobilehosts: ['mh5', 'mh6', 'mh7'],
        reqQ: [],
        grantQ: []}]);

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const indexByMSSName = (name) => {
        var index = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == name) index = i;
        }
        return index;
    } 

    const join = (mhid, reqloc) => {
        const MSSArrFrom = data.filter(mss => mss.mobilehosts.includes(mhid))
        const MSSArrTo = data.filter(mss => mss.name == reqloc)
        var newData = data.map(l => Object.assign({}, l));
        
        setData(newData)
    }

    const move = async () => {
        const MSSArrFrom = data.filter(mss => mss.mobilehosts.includes(mhFrom))
        const MSSArrTo = data.filter(mss => mss.name == mssTo)
        var newData = data.map(l => Object.assign({}, l));
        newData[indexByMSSName(MSSArrFrom[0].name)].mobilehosts = data[indexByMSSName(MSSArrFrom.name)].mobilehosts.filter(mh => mh != mhFrom)
        newData[indexByMSSName(MSSArrTo[0].name)].mobilehosts = [mhFrom, ...newData[indexByMSSName(MSSArrTo[0].name)].mobilehosts]
        // join(mhid, req_loc)
        var before = data[indexByMSSName(MSSArrFrom.name)].reqQ.length;
        newData[indexByMSSName(MSSArrFrom[0].name)].reqQ = data[indexByMSSName(MSSArrFrom.name)].reqQ.filter(mh => mh != mhFrom)
        var after = newData[indexByMSSName(MSSArrFrom[0].name)].reqQ.length;
        var reqs = new Array(before - after).fill(mhFrom);
        console.log(data, newData, before, after, mhFrom)
        newData[indexByMSSName(MSSArrTo[0].name)].reqQ = [...newData[indexByMSSName(MSSArrTo[0].name)].reqQ, ...reqs]
        setData(newData);
    }

    const requestToken = () => {
        const MSSArrFrom = data.filter(mss => mss.mobilehosts.includes(mhReqToken))
        var newData = data.map(l => Object.assign({}, l));
        console.log(mhReqToken, MSSArrFrom);
        newData[indexByMSSName(MSSArrFrom[0].name)].reqQ = [...newData[indexByMSSName(MSSArrFrom[0].name)].reqQ, mhReqToken]
        setData(newData);
    }

    const executeAlgorithm = async () => {
        if (mssTurn == data.length) return;
        var newData = data.map(l => Object.assign({}, l));
        newData[mssTurn].grantQ = newData[mssTurn].reqQ;
        newData[mssTurn].reqQ = [];
        setData(newData);
        await sleep(1000);
        var oldData = data.map(l => Object.assign({}, l));
        oldData[mssTurn].grantQ = [];
        oldData[mssTurn].reqQ = [];
        setData(oldData);
        setMssTurn(mssTurn + 1);
    }

    useEffect(executeAlgorithm, [mssTurn]);

    return <div>
        {/* draw a table */}
        Mobilehost: <input onChange={(e) => setMhFrom(e.target.value)}></input>
        To: <input onChange={(e) => setMssTo(e.target.value)}></input>
        <button onClick={move}>Move</button>
        <br/>

        Mobilehost: <input onChange={(e) => setMhReqToken(e.target.value)} />
        <button onClick={requestToken}>Request Token</button>
        <br/>

        <button onClick={() => {setMssTurn(0)}}>Execute Algorithm</button>
        { data.map(mobileStation => 
        <>
        <div>{mobileStation.name}</div>
        <table>
            <tr>
                <th>Mobile hosts</th>
                <th>Request Queue</th>
                <th>Grant Queue</th>
            </tr>
            <tr>
                <td>{mobileStation.mobilehosts.join(', ')}</td>
                <td>{mobileStation.reqQ.join(', ')}</td>
                <td>{mobileStation.grantQ.join(', ')}</td>
            </tr>
        </table>
        </>) }
    </div>;
}

export default InformBased;