pragma solidity >=0.4.22 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Registry.sol";

contract TestRegistry {
	
	function testAdicionarRegister() public{

		Registry r = Registry(DeployedAddresses.Registry());

		uint expected = r.numRegisters() + 2;

		r.adicionarRegister(0xd9BC30e310Cf96635cCF8245F4d159B76CaC397d);

		r.adicionarRegister(0x1bFFFD901DC1BaA64FAea681a12092579D775e0c);

		Assert.equal(r.numRegisters(), 2, "Another register should have been added...");
	}

	// Teste para verificar a integridade do hash dos metadados aquando do adicionar de uma nova notarização.
	function testAdicionarNotarization() public{

		Registry r = Registry(DeployedAddresses.Registry());

		// Adicionamos um register para adicionar o doc
		r.adicionarRegister(msg.sender);

		Assert.equal(r.isRegister(msg.sender), true, "Not registed...");
	}

	// Teste da transferência da propriedade
	// function testTransPropNotarization() public{

	//	Registry r = Registry(DeployedAddresses.Registry());

	//	r.transferirPropriedade("owner:Nelson Faria,data:03-05-2021", r.calculateHash("Este é o conteúdo do documento"));

	//	Assert.equal(r.getHMetadata(r.calculateHash("Este é o conteúdo do documento")), r.calculateHash("owner:Nelson Faria,data:03-05-2021"),"HMetadata does not correspond...");
	//}

	function testAdicionaNotarization() public {

		Registry r = Registry(DeployedAddresses.Registry());

		// Adicionamos um register para adicionar o doc
		// r.adicionarRegister(msg.sender);

		r.adicionarNotarization("hashficheiro", "hashmetadados");

		string memory ola = "hashmetadados";

		Assert.equal(r.isNotarized(ola), true, "Not notarized...");
	}

}