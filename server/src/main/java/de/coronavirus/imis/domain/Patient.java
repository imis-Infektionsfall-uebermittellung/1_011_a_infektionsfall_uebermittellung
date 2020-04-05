package de.coronavirus.imis.domain;


import java.time.LocalDate;
import java.util.List;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Patient {
    @Id
    private String id;

    private String lastName;
    private String firstName;
    private String gender;
    private LocalDate dateOfBirth;

    private String email;
    private String phoneNumber;
    private String street;
    private String houseNumber;
    private Integer zip;
    private String city;

    private String insuranceCompany;
    private String insuranceMembershipNumber;
    private boolean confirmed;

    private Boolean fluImmunization;
    private String speedOfSymptomsOutbreak;
    @Convert(converter = StringListConverter.class)
    private List<String> symptoms;

    private Boolean coronaContacts;
    @Convert(converter = StringListConverter.class)
    private List<String> riskAreas;

    private Boolean weakenedImmuneSystem;
    @Convert(converter = StringListConverter.class)
    private List<String> preIllnesses;

    @Enumerated(EnumType.STRING)
    private RiskOccupation riskOccupation;

    private String comment;
    private String occupation;

    @OneToMany(mappedBy = "patient")
//    @JsonManagedReference
    List<PatientEvent> events;
}
